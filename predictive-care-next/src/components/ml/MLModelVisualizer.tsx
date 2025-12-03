"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadialProgress, StatusIndicator } from "@/components/charts/GaugeChart";
import {
  Brain,
  Activity,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

interface PredictionResult {
  failure_probability: number;
  risk_level: string;
  confidence: number;
  feature_importance: Record<string, number>;
  prediction_time: string;
  model_type: string;
}

interface MLModelVisualizerProps {
  className?: string;
  sensorData?: {
    air_temperature: number;
    process_temperature: number;
    rotational_speed: number;
    torque: number;
    tool_wear: number;
  };
  autoPredict?: boolean;
  predictionInterval?: number;
}

export function MLModelVisualizer({
  className,
  sensorData,
  autoPredict = true,
  predictionInterval = 5000,
}: MLModelVisualizerProps) {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [modelStatus, setModelStatus] = useState<"healthy" | "warning" | "critical" | "offline">("healthy");

  // Simulate ML prediction
  const makePrediction = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate realistic prediction based on sensor data
    const data = sensorData || {
      air_temperature: 298 + Math.random() * 5,
      process_temperature: 308 + Math.random() * 10,
      rotational_speed: 1400 + Math.random() * 200,
      torque: 35 + Math.random() * 20,
      tool_wear: Math.random() * 250,
    };

    const tempDiff = data.process_temperature - data.air_temperature;
    const power = (2 * Math.PI * data.rotational_speed * data.torque) / 60;

    // Calculate risk score
    let riskScore = 0;
    riskScore += Math.min(data.tool_wear / 250, 0.4);
    riskScore += Math.min(Math.max(tempDiff - 8, 0) / 12, 0.3);
    riskScore += Math.min(power / 15000, 0.3);

    const failureProbability = Math.min(riskScore, 0.99);
    let riskLevel: string;
    if (failureProbability >= 0.7) riskLevel = "critical";
    else if (failureProbability >= 0.5) riskLevel = "high";
    else if (failureProbability >= 0.3) riskLevel = "medium";
    else riskLevel = "low";

    setPrediction({
      failure_probability: failureProbability,
      risk_level: riskLevel,
      confidence: 0.85 + Math.random() * 0.1,
      feature_importance: {
        tool_wear: 0.35,
        temperature_diff: 0.25,
        power: 0.20,
        torque: 0.12,
        rotational_speed: 0.08,
      },
      prediction_time: new Date().toISOString(),
      model_type: "ensemble",
    });

    setLastUpdate(new Date());
    setIsLoading(false);

    // Update model status based on prediction
    if (failureProbability >= 0.7) setModelStatus("critical");
    else if (failureProbability >= 0.4) setModelStatus("warning");
    else setModelStatus("healthy");
  };

  useEffect(() => {
    makePrediction();

    if (autoPredict) {
      const interval = setInterval(makePrediction, predictionInterval);
      return () => clearInterval(interval);
    }
  }, [autoPredict, predictionInterval, sensorData]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "#ef4444";
      case "high":
        return "#f97316";
      case "medium":
        return "#eab308";
      case "low":
        return "#22c55e";
      default:
        return "#6b7280";
    }
  };

  return (
    <Card variant="gradient" className={cn("overflow-hidden", className)}>
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              {isLoading && (
                <motion.div
                  className="absolute -inset-1 rounded-xl border-2 border-purple-500"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">ML Model Engine</CardTitle>
              <p className="text-xs text-gray-400 mt-0.5">
                Ensemble (XGBoost + LightGBM + CatBoost)
              </p>
            </div>
          </div>
          <StatusIndicator status={modelStatus} label={modelStatus} />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {isLoading && !prediction ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </motion.div>
          ) : prediction ? (
            <motion.div
              key="prediction"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Prediction Result */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 flex justify-center">
                  <RadialProgress
                    value={prediction.failure_probability * 100}
                    label="Failure Risk"
                    color={getRiskColor(prediction.risk_level)}
                    size={140}
                    strokeWidth={12}
                  />
                </div>

                <div className="col-span-2 space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-gray-400">Risk Level</span>
                    </div>
                    <Badge
                      variant={
                        prediction.risk_level === "critical"
                          ? "danger"
                          : prediction.risk_level === "high"
                          ? "warning"
                          : prediction.risk_level === "medium"
                          ? "warning"
                          : "success"
                      }
                      pulse={prediction.risk_level === "critical"}
                    >
                      {prediction.risk_level.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-400">Confidence</span>
                    </div>
                    <span className="text-lg font-semibold text-white">
                      {(prediction.confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-400">Model Type</span>
                    </div>
                    <span className="text-sm font-medium text-white capitalize">
                      {prediction.model_type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature Importance */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">Feature Importance</span>
                </div>
                <div className="space-y-3">
                  {Object.entries(prediction.feature_importance)
                    .sort(([, a], [, b]) => b - a)
                    .map(([feature, importance], index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-1"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400 capitalize">
                            {feature.replace(/_/g, " ")}
                          </span>
                          <span className="text-white font-medium">
                            {(importance * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={importance * 100}
                          variant={index === 0 ? "gradient" : "default"}
                          className="h-1.5"
                        />
                      </motion.div>
                    ))}
                </div>
              </div>

              {/* Last Update */}
              {lastUpdate && (
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// Animated Neural Network visualization
interface NeuralNetworkProps {
  className?: string;
  isActive?: boolean;
}

export function NeuralNetwork({ className, isActive = true }: NeuralNetworkProps) {
  const layers = [4, 8, 8, 4, 1];
  const nodeRadius = 8;
  const layerSpacing = 80;
  const nodeSpacing = 30;

  const getNodePositions = () => {
    const positions: Array<Array<{ x: number; y: number }>> = [];
    const width = (layers.length - 1) * layerSpacing + 60;
    
    layers.forEach((nodeCount, layerIndex) => {
      const layerPositions: Array<{ x: number; y: number }> = [];
      const x = 30 + layerIndex * layerSpacing;
      const layerHeight = (nodeCount - 1) * nodeSpacing;
      const startY = (200 - layerHeight) / 2;
      
      for (let i = 0; i < nodeCount; i++) {
        layerPositions.push({ x, y: startY + i * nodeSpacing });
      }
      positions.push(layerPositions);
    });

    return positions;
  };

  const positions = getNodePositions();

  return (
    <svg
      viewBox="0 0 360 200"
      className={cn("w-full h-auto", className)}
    >
      {/* Connections */}
      {positions.map((layer, layerIndex) =>
        layerIndex < positions.length - 1
          ? layer.map((node, nodeIndex) =>
              positions[layerIndex + 1].map((nextNode, nextNodeIndex) => (
                <motion.line
                  key={`${layerIndex}-${nodeIndex}-${nextNodeIndex}`}
                  x1={node.x}
                  y1={node.y}
                  x2={nextNode.x}
                  y2={nextNode.y}
                  stroke="rgba(34, 211, 238, 0.2)"
                  strokeWidth={1}
                  initial={{ pathLength: 0 }}
                  animate={{
                    pathLength: 1,
                    stroke: isActive
                      ? [
                          "rgba(34, 211, 238, 0.1)",
                          "rgba(34, 211, 238, 0.4)",
                          "rgba(34, 211, 238, 0.1)",
                        ]
                      : "rgba(34, 211, 238, 0.1)",
                  }}
                  transition={{
                    pathLength: { duration: 1 },
                    stroke: {
                      duration: 2,
                      repeat: Infinity,
                      delay: (layerIndex + nodeIndex + nextNodeIndex) * 0.1,
                    },
                  }}
                />
              ))
            )
          : null
      )}

      {/* Nodes */}
      {positions.map((layer, layerIndex) =>
        layer.map((node, nodeIndex) => (
          <motion.g key={`node-${layerIndex}-${nodeIndex}`}>
            {/* Glow effect */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={nodeRadius + 4}
              fill="rgba(34, 211, 238, 0.3)"
              animate={{
                r: isActive ? [nodeRadius + 4, nodeRadius + 8, nodeRadius + 4] : nodeRadius + 4,
                opacity: isActive ? [0.3, 0.6, 0.3] : 0.3,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: (layerIndex + nodeIndex) * 0.2,
              }}
            />
            {/* Node */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={nodeRadius}
              fill="#0f172a"
              stroke="#22d3ee"
              strokeWidth={2}
              animate={{
                fill: isActive
                  ? ["#0f172a", "#164e63", "#0f172a"]
                  : "#0f172a",
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: (layerIndex + nodeIndex) * 0.15,
              }}
            />
          </motion.g>
        ))
      )}

      {/* Layer labels */}
      <text x="30" y="195" fill="rgba(255,255,255,0.5)" fontSize="8" textAnchor="middle">
        Input
      </text>
      <text x="190" y="195" fill="rgba(255,255,255,0.5)" fontSize="8" textAnchor="middle">
        Hidden Layers
      </text>
      <text x="350" y="195" fill="rgba(255,255,255,0.5)" fontSize="8" textAnchor="middle">
        Output
      </text>
    </svg>
  );
}
