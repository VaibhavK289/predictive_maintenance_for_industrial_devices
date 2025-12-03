"""
Enterprise Predictive Maintenance ML System - Core ML Engine
Advanced ML pipeline with ensemble models and automated feature engineering
"""
import numpy as np
import pandas as pd
from typing import Dict, Any, Optional, Tuple, List
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from imblearn.over_sampling import SMOTE, ADASYN
import xgboost as xgb
import lightgbm as lgb
from catboost import CatBoostClassifier
import joblib
from datetime import datetime
import uuid
from pathlib import Path
import structlog

from schemas.models import (
    SensorReading, FeatureVector, PredictionResult, 
    TrainingConfig, TrainingMetrics, ModelInfo
)
from config.settings import get_settings

logger = structlog.get_logger()
settings = get_settings()


class FeatureEngineer:
    """Advanced feature engineering for predictive maintenance"""
    
    FEATURE_COLUMNS = ['Type_H', 'Type_L', 'Type_M', 'Tool wear', 'Power', 'temp_diff']
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.is_fitted = False
    
    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply feature engineering transformations"""
        df = df.copy()
        
        # Calculate derived features
        if 'Rotational speed' in df.columns and 'Torque' in df.columns:
            df['Power'] = 2 * np.pi * df['Rotational speed'] * df['Torque'] / 60
        
        if 'Process temperature' in df.columns and 'Air temperature' in df.columns:
            df['temp_diff'] = df['Process temperature'] - df['Air temperature']
        
        # One-hot encode machine type
        if 'Type' in df.columns:
            type_dummies = pd.get_dummies(df['Type'], prefix='Type')
            df = pd.concat([df, type_dummies], axis=1)
            for col in ['Type_H', 'Type_L', 'Type_M']:
                if col not in df.columns:
                    df[col] = 0
            df[['Type_H', 'Type_L', 'Type_M']] = df[['Type_H', 'Type_L', 'Type_M']].astype(int)
        
        # Additional engineered features
        if 'Power' in df.columns and 'Tool wear' in df.columns:
            df['power_wear_ratio'] = df['Power'] / (df['Tool wear'] + 1)
            df['wear_squared'] = df['Tool wear'] ** 2
        
        if 'temp_diff' in df.columns:
            df['temp_stress'] = df['temp_diff'] * df.get('Power', 1) / 10000
        
        return df
    
    def prepare_features(self, df: pd.DataFrame, training: bool = False) -> Tuple[np.ndarray, Optional[np.ndarray]]:
        """Prepare features for model training/prediction"""
        df = self.engineer_features(df)
        
        # Select features
        feature_cols = [col for col in self.FEATURE_COLUMNS if col in df.columns]
        
        # Add additional engineered features if available
        extra_cols = ['power_wear_ratio', 'wear_squared', 'temp_stress']
        for col in extra_cols:
            if col in df.columns:
                feature_cols.append(col)
        
        X = df[feature_cols].values
        
        # Get target if training
        y = None
        if training and 'Machine failure' in df.columns:
            y = df['Machine failure'].values
        elif training and 'Target' in df.columns:
            y = df['Target'].values
        
        # Fit/transform scaler
        if training:
            X = self.scaler.fit_transform(X)
            self.is_fitted = True
        elif self.is_fitted:
            X = self.scaler.transform(X)
        
        return X, y
    
    def sensor_to_features(self, reading: SensorReading) -> np.ndarray:
        """Convert sensor reading to feature vector"""
        feature_vec = FeatureVector.from_sensor_reading(reading)
        return feature_vec.to_numpy()


class PredictiveMaintenanceModel:
    """Enterprise-grade predictive maintenance ML model"""
    
    def __init__(self, model_type: str = "ensemble"):
        self.model_type = model_type
        self.model = None
        self.feature_engineer = FeatureEngineer()
        self.model_id = str(uuid.uuid4())[:8]
        self.version = "1.0.0"
        self.is_trained = False
        self.feature_importances: Dict[str, float] = {}
        self.training_metrics: Optional[TrainingMetrics] = None
    
    def _create_model(self, config: TrainingConfig) -> Any:
        """Create model based on configuration"""
        if config.model_type == "xgboost":
            return xgb.XGBClassifier(
                n_estimators=config.hyperparameters.get('n_estimators', 200),
                max_depth=config.hyperparameters.get('max_depth', 6),
                learning_rate=config.hyperparameters.get('learning_rate', 0.1),
                subsample=config.hyperparameters.get('subsample', 0.8),
                colsample_bytree=config.hyperparameters.get('colsample_bytree', 0.8),
                random_state=settings.ml.random_state,
                use_label_encoder=False,
                eval_metric='logloss',
                early_stopping_rounds=10 if config.early_stopping else None
            )
        
        elif config.model_type == "lightgbm":
            return lgb.LGBMClassifier(
                n_estimators=config.hyperparameters.get('n_estimators', 200),
                max_depth=config.hyperparameters.get('max_depth', 6),
                learning_rate=config.hyperparameters.get('learning_rate', 0.1),
                subsample=config.hyperparameters.get('subsample', 0.8),
                colsample_bytree=config.hyperparameters.get('colsample_bytree', 0.8),
                random_state=settings.ml.random_state,
                verbose=-1
            )
        
        elif config.model_type == "catboost":
            return CatBoostClassifier(
                iterations=config.hyperparameters.get('iterations', 200),
                depth=config.hyperparameters.get('depth', 6),
                learning_rate=config.hyperparameters.get('learning_rate', 0.1),
                random_state=settings.ml.random_state,
                verbose=False
            )
        
        elif config.model_type == "random_forest":
            return RandomForestClassifier(
                n_estimators=config.hyperparameters.get('n_estimators', 200),
                max_depth=config.hyperparameters.get('max_depth', 10),
                min_samples_split=config.hyperparameters.get('min_samples_split', 5),
                random_state=settings.ml.random_state,
                n_jobs=-1
            )
        
        elif config.model_type == "ensemble":
            # Create voting ensemble
            xgb_model = xgb.XGBClassifier(
                n_estimators=100, max_depth=5, learning_rate=0.1,
                random_state=settings.ml.random_state, use_label_encoder=False, 
                eval_metric='logloss'
            )
            lgb_model = lgb.LGBMClassifier(
                n_estimators=100, max_depth=5, learning_rate=0.1,
                random_state=settings.ml.random_state, verbose=-1
            )
            rf_model = RandomForestClassifier(
                n_estimators=100, max_depth=10,
                random_state=settings.ml.random_state, n_jobs=-1
            )
            
            return VotingClassifier(
                estimators=[
                    ('xgb', xgb_model),
                    ('lgb', lgb_model),
                    ('rf', rf_model)
                ],
                voting='soft'
            )
        
        raise ValueError(f"Unknown model type: {config.model_type}")
    
    def _handle_imbalance(self, X: np.ndarray, y: np.ndarray, method: str) -> Tuple[np.ndarray, np.ndarray]:
        """Handle class imbalance in training data"""
        if method == "smote":
            sampler = SMOTE(random_state=settings.ml.random_state)
        elif method == "adasyn":
            sampler = ADASYN(random_state=settings.ml.random_state)
        else:
            return X, y
        
        X_resampled, y_resampled = sampler.fit_resample(X, y)
        logger.info(
            "Applied class balancing",
            method=method,
            original_samples=len(y),
            resampled_samples=len(y_resampled)
        )
        return X_resampled, y_resampled
    
    def train(
        self,
        data: pd.DataFrame,
        config: Optional[TrainingConfig] = None
    ) -> TrainingMetrics:
        """Train the predictive maintenance model"""
        start_time = datetime.utcnow()
        
        if config is None:
            config = TrainingConfig(model_type=self.model_type)
        
        logger.info("Starting model training", model_type=config.model_type)
        
        # Prepare features
        X, y = self.feature_engineer.prepare_features(data, training=True)
        
        if y is None:
            raise ValueError("No target column found in training data")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y,
            test_size=config.test_size,
            random_state=settings.ml.random_state,
            stratify=y if config.stratify else None
        )
        
        # Handle class imbalance
        if config.handle_imbalance:
            X_train, y_train = self._handle_imbalance(X_train, y_train, config.imbalance_method)
        
        # Create and train model
        self.model = self._create_model(config)
        
        if config.cross_validation:
            # Cross-validation
            cv = StratifiedKFold(n_splits=config.cv_folds, shuffle=True, random_state=settings.ml.random_state)
            cv_scores = cross_val_score(self.model, X_train, y_train, cv=cv, scoring='roc_auc')
            logger.info("Cross-validation complete", mean_auc=cv_scores.mean(), std_auc=cv_scores.std())
        
        # Final training
        self.model.fit(X_train, y_train)
        self.is_trained = True
        
        # Evaluate
        y_pred = self.model.predict(X_test)
        y_prob = self.model.predict_proba(X_test)[:, 1]
        
        # Calculate metrics
        tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()
        
        # Feature importance
        self._extract_feature_importance()
        
        training_time = (datetime.utcnow() - start_time).total_seconds()
        
        # Create metrics object
        self.training_metrics = TrainingMetrics(
            model_id=self.model_id,
            model_type=config.model_type,
            accuracy=accuracy_score(y_test, y_pred),
            precision=precision_score(y_test, y_pred, zero_division=0),
            recall=recall_score(y_test, y_pred, zero_division=0),
            f1_score=f1_score(y_test, y_pred, zero_division=0),
            auc_roc=roc_auc_score(y_test, y_prob),
            cost_benefit_score=self._calculate_cost_benefit(y_test, y_pred),
            true_positives=int(tp),
            true_negatives=int(tn),
            false_positives=int(fp),
            false_negatives=int(fn),
            training_samples=len(y_train),
            test_samples=len(y_test),
            training_time_seconds=training_time,
            feature_importances=self.feature_importances
        )
        
        logger.info(
            "Model training complete",
            accuracy=self.training_metrics.accuracy,
            auc_roc=self.training_metrics.auc_roc,
            f1_score=self.training_metrics.f1_score
        )
        
        return self.training_metrics
    
    def _extract_feature_importance(self):
        """Extract feature importance from trained model"""
        feature_names = self.feature_engineer.FEATURE_COLUMNS + ['power_wear_ratio', 'wear_squared', 'temp_stress']
        
        if hasattr(self.model, 'feature_importances_'):
            importances = self.model.feature_importances_
        elif hasattr(self.model, 'estimators_'):
            # Ensemble model
            importances = np.mean([
                est.feature_importances_ for est in self.model.estimators_
                if hasattr(est, 'feature_importances_')
            ], axis=0)
        else:
            importances = np.ones(len(feature_names)) / len(feature_names)
        
        # Match features to importances
        for i, name in enumerate(feature_names[:len(importances)]):
            self.feature_importances[name] = float(importances[i])
    
    def _calculate_cost_benefit(self, y_true: np.ndarray, y_pred: np.ndarray) -> float:
        """Calculate cost-benefit score"""
        maintenance_cost = settings.ml.maintenance_cost
        failure_cost = settings.ml.failure_cost
        
        tp = np.where((y_pred == 1) & (y_true == 1), failure_cost - maintenance_cost, 0)
        fp = np.where((y_pred == 1) & (y_true == 0), -maintenance_cost, 0)
        
        return float(np.sum(tp) + np.sum(fp))
    
    def predict(self, reading: SensorReading) -> PredictionResult:
        """Make prediction for a single sensor reading"""
        if not self.is_trained:
            raise RuntimeError("Model must be trained before making predictions")
        
        features = self.feature_engineer.sensor_to_features(reading)
        
        # Scale features
        if self.feature_engineer.is_fitted:
            # Pad features to match training dimensions
            if features.shape[1] < len(self.feature_engineer.FEATURE_COLUMNS):
                padding = np.zeros((1, len(self.feature_engineer.FEATURE_COLUMNS) - features.shape[1]))
                features = np.hstack([features, padding])
            features = self.feature_engineer.scaler.transform(features)
        
        probability = self.model.predict_proba(features)[0][1]
        
        return PredictionResult.from_model_output(
            machine_id=reading.machine_id,
            probability=probability,
            model_version=f"{self.model_id}-{self.version}",
            feature_importance=self.feature_importances
        )
    
    def predict_batch(self, readings: List[SensorReading]) -> List[PredictionResult]:
        """Make predictions for multiple sensor readings"""
        return [self.predict(reading) for reading in readings]
    
    def save(self, path: Optional[str] = None) -> str:
        """Save model to disk"""
        if path is None:
            path = Path(settings.ml.model_path) / f"model_{self.model_id}.joblib"
        
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        
        model_data = {
            'model': self.model,
            'feature_engineer': self.feature_engineer,
            'model_id': self.model_id,
            'version': self.version,
            'model_type': self.model_type,
            'feature_importances': self.feature_importances,
            'training_metrics': self.training_metrics
        }
        
        joblib.dump(model_data, path)
        logger.info("Model saved", path=str(path))
        
        return str(path)
    
    @classmethod
    def load(cls, path: str) -> 'PredictiveMaintenanceModel':
        """Load model from disk"""
        model_data = joblib.load(path)
        
        instance = cls(model_type=model_data['model_type'])
        instance.model = model_data['model']
        instance.feature_engineer = model_data['feature_engineer']
        instance.model_id = model_data['model_id']
        instance.version = model_data['version']
        instance.feature_importances = model_data['feature_importances']
        instance.training_metrics = model_data['training_metrics']
        instance.is_trained = True
        
        logger.info("Model loaded", model_id=instance.model_id, version=instance.version)
        
        return instance
