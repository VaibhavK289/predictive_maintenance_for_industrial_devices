"""
End-to-End Integration Test Script
Tests the complete system: Frontend + Backend + ML Pipeline

Run with: python tests/test_integration.py
"""
import requests
import json
import time
import sys
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configuration
FRONTEND_URL = "http://localhost:3000"
BACKEND_URL = "http://localhost:8000"

# Colors for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'


def color_print(text, color=Colors.END):
    """Print colored text"""
    print(f"{color}{text}{Colors.END}")


def print_section(title):
    """Print section header"""
    print()
    color_print("━" * 60, Colors.CYAN)
    color_print(f"  {title}", Colors.BOLD)
    color_print("━" * 60, Colors.CYAN)


def print_test_result(name, passed, details="", duration_ms=None):
    """Print test result with status"""
    icon = "✓" if passed else "✗"
    color = Colors.GREEN if passed else Colors.RED
    duration_str = f" ({duration_ms:.0f}ms)" if duration_ms else ""
    color_print(f"  {icon} {name}{duration_str}", color)
    if details:
        print(f"      {details}")


class TestResult:
    """Store test results"""
    def __init__(self, name, passed, details="", duration_ms=0):
        self.name = name
        self.passed = passed
        self.details = details
        self.duration_ms = duration_ms


class IntegrationTester:
    """Integration test runner"""
    
    def __init__(self):
        self.results = []
        self.start_time = None
    
    def add_result(self, result: TestResult):
        """Add test result"""
        self.results.append(result)
        print_test_result(result.name, result.passed, result.details, result.duration_ms)
    
    def run_test(self, name, test_func):
        """Run a single test with timing"""
        start = time.time()
        try:
            passed, details = test_func()
            duration = (time.time() - start) * 1000
            self.add_result(TestResult(name, passed, details, duration))
        except Exception as e:
            duration = (time.time() - start) * 1000
            self.add_result(TestResult(name, False, str(e), duration))
    
    # ==================== SERVICE AVAILABILITY TESTS ====================
    
    def test_backend_available(self):
        """Test if backend is running"""
        try:
            resp = requests.get(f"{BACKEND_URL}/health", timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                return True, f"Status: {data.get('status')}"
            return False, f"Status code: {resp.status_code}"
        except requests.exceptions.ConnectionError:
            return False, "Connection refused - Backend not running"
    
    def test_frontend_available(self):
        """Test if frontend is running"""
        try:
            resp = requests.get(FRONTEND_URL, timeout=5)
            if resp.status_code == 200:
                return True, "Frontend accessible"
            return False, f"Status code: {resp.status_code}"
        except requests.exceptions.ConnectionError:
            return False, "Connection refused - Frontend not running"
    
    # ==================== ML PIPELINE TESTS ====================
    
    def test_model_loaded(self):
        """Test if ML model is loaded"""
        try:
            resp = requests.get(f"{BACKEND_URL}/api/model/status", timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                trained = data.get("trained", False)
                model_type = data.get("model_type", "unknown")
                if trained:
                    return True, f"Model type: {model_type}"
                return False, "Model not trained"
            return False, f"Status code: {resp.status_code}"
        except Exception as e:
            return False, str(e)
    
    def test_prediction_accuracy(self):
        """Test prediction with known scenarios"""
        test_cases = [
            # Normal operation should predict low risk
            {
                "data": {
                    "machine_id": "TEST-NORMAL",
                    "machine_type": "M",
                    "air_temperature": 300.0,
                    "process_temperature": 310.0,
                    "rotational_speed": 1500,
                    "torque": 40.0,
                    "tool_wear": 50
                },
                "expected_low_risk": True
            },
            # Critical tool wear should predict high risk
            {
                "data": {
                    "machine_id": "TEST-CRITICAL",
                    "machine_type": "M",
                    "air_temperature": 300.0,
                    "process_temperature": 318.0,
                    "rotational_speed": 2000,
                    "torque": 65.0,
                    "tool_wear": 220
                },
                "expected_low_risk": False
            }
        ]
        
        correct = 0
        for case in test_cases:
            try:
                resp = requests.post(
                    f"{BACKEND_URL}/api/predict/quick",
                    json=case["data"],
                    timeout=10
                )
                if resp.status_code == 200:
                    data = resp.json()
                    risk = data.get("risk_level", "unknown")
                    is_low = risk in ["low", "medium"]
                    if is_low == case["expected_low_risk"]:
                        correct += 1
            except:
                pass
        
        if correct == len(test_cases):
            return True, f"{correct}/{len(test_cases)} predictions correct"
        return False, f"Only {correct}/{len(test_cases)} predictions correct"
    
    def test_feature_importance(self):
        """Test that feature importance is returned"""
        test_data = {
            "machine_id": "TEST-FI",
            "machine_type": "M",
            "air_temperature": 300.0,
            "process_temperature": 310.0,
            "rotational_speed": 1500,
            "torque": 40.0,
            "tool_wear": 150
        }
        
        try:
            resp = requests.post(
                f"{BACKEND_URL}/api/predict/quick",
                json=test_data,
                timeout=10
            )
            if resp.status_code == 200:
                data = resp.json()
                importance = data.get("feature_importance", {})
                if len(importance) > 0:
                    top_feature = max(importance, key=importance.get)
                    return True, f"Top feature: {top_feature} ({importance[top_feature]:.1%})"
                return False, "No feature importance returned"
            return False, f"Status code: {resp.status_code}"
        except Exception as e:
            return False, str(e)
    
    # ==================== KNOWLEDGE BASE TESTS ====================
    
    def test_knowledge_base_populated(self):
        """Test knowledge base has documents"""
        try:
            resp = requests.get(f"{BACKEND_URL}/api/knowledge/stats", timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                doc_count = data.get("document_count", 0)
                if doc_count > 0:
                    return True, f"{doc_count} documents in knowledge base"
                return False, "Knowledge base is empty"
            return False, f"Status code: {resp.status_code}"
        except Exception as e:
            return False, str(e)
    
    def test_knowledge_query(self):
        """Test knowledge base query functionality"""
        queries = [
            "tool wear failure prevention",
            "heat dissipation cooling",
            "maintenance schedule"
        ]
        
        successful = 0
        for query in queries:
            try:
                resp = requests.get(
                    f"{BACKEND_URL}/api/knowledge/query",
                    params={"query": query, "n_results": 2},
                    timeout=15
                )
                if resp.status_code == 200:
                    data = resp.json()
                    if len(data.get("results", [])) > 0:
                        successful += 1
            except:
                pass
        
        if successful == len(queries):
            return True, f"All {len(queries)} queries returned results"
        return False, f"Only {successful}/{len(queries)} queries successful"
    
    # ==================== API ENDPOINT TESTS ====================
    
    def test_batch_processing(self):
        """Test batch prediction capability"""
        readings = []
        for i in range(5):
            readings.append({
                "machine_id": f"BATCH-{i}",
                "machine_type": "M",
                "air_temperature": 298.0 + i,
                "process_temperature": 308.0 + i,
                "rotational_speed": 1400 + i * 100,
                "torque": 40.0 + i * 5,
                "tool_wear": 50 + i * 30
            })
        
        try:
            resp = requests.post(
                f"{BACKEND_URL}/api/predict/batch",
                json={"readings": readings, "include_recommendations": True},
                timeout=30
            )
            if resp.status_code == 200:
                data = resp.json()
                count = data.get("count", 0)
                if count == len(readings):
                    return True, f"Processed {count} readings in batch"
                return False, f"Expected {len(readings)}, got {count}"
            return False, f"Status code: {resp.status_code}"
        except Exception as e:
            return False, str(e)
    
    def test_analysis_endpoint(self):
        """Test full analysis endpoint"""
        test_data = {
            "machine_id": "ANALYSIS-TEST",
            "machine_type": "H",
            "air_temperature": 302.0,
            "process_temperature": 315.0,
            "rotational_speed": 1800,
            "torque": 55.0,
            "tool_wear": 180
        }
        
        try:
            resp = requests.post(
                f"{BACKEND_URL}/api/analyze",
                json=test_data,
                timeout=30
            )
            if resp.status_code == 200:
                data = resp.json()
                analysis = data.get("analysis", {})
                concerns = analysis.get("concerns", [])
                return True, f"Analysis returned {len(concerns)} concerns"
            return False, f"Status code: {resp.status_code}"
        except Exception as e:
            return False, str(e)
    
    def test_recommendations_quality(self):
        """Test that recommendations are actionable"""
        # High-risk scenario
        test_data = {
            "machine_id": "REC-TEST",
            "machine_type": "M",
            "air_temperature": 300.0,
            "process_temperature": 318.0,
            "rotational_speed": 2200,
            "torque": 65.0,
            "tool_wear": 200
        }
        
        try:
            resp = requests.post(
                f"{BACKEND_URL}/api/recommendations",
                json=test_data,
                timeout=30
            )
            if resp.status_code == 200:
                data = resp.json()
                recs = data.get("recommendations", [])
                # Check for critical priority recommendations
                critical = [r for r in recs if r.get("priority") in ["critical", "high"]]
                if len(critical) > 0:
                    return True, f"{len(critical)} high-priority recommendations"
                return False, "No critical recommendations for high-risk scenario"
            return False, f"Status code: {resp.status_code}"
        except Exception as e:
            return False, str(e)
    
    # ==================== PERFORMANCE TESTS ====================
    
    def test_concurrent_requests(self):
        """Test handling of concurrent requests"""
        test_data = {
            "machine_id": "CONCURRENT-TEST",
            "machine_type": "M",
            "air_temperature": 300.0,
            "process_temperature": 310.0,
            "rotational_speed": 1500,
            "torque": 40.0,
            "tool_wear": 100
        }
        
        def make_request():
            resp = requests.post(
                f"{BACKEND_URL}/api/predict/quick",
                json=test_data,
                timeout=10
            )
            return resp.status_code == 200
        
        num_requests = 10
        successful = 0
        
        try:
            with ThreadPoolExecutor(max_workers=5) as executor:
                futures = [executor.submit(make_request) for _ in range(num_requests)]
                for future in as_completed(futures):
                    if future.result():
                        successful += 1
            
            if successful == num_requests:
                return True, f"All {num_requests} concurrent requests succeeded"
            return False, f"Only {successful}/{num_requests} requests succeeded"
        except Exception as e:
            return False, str(e)
    
    def test_response_latency(self):
        """Test API response latency"""
        test_data = {
            "machine_id": "LATENCY-TEST",
            "machine_type": "M",
            "air_temperature": 300.0,
            "process_temperature": 310.0,
            "rotational_speed": 1500,
            "torque": 40.0,
            "tool_wear": 100
        }
        
        latencies = []
        
        for _ in range(5):
            start = time.time()
            try:
                resp = requests.post(
                    f"{BACKEND_URL}/api/predict/quick",
                    json=test_data,
                    timeout=10
                )
                if resp.status_code == 200:
                    latencies.append((time.time() - start) * 1000)
            except:
                pass
        
        if len(latencies) > 0:
            avg_latency = sum(latencies) / len(latencies)
            max_latency = max(latencies)
            if avg_latency < 500:
                return True, f"Avg: {avg_latency:.0f}ms, Max: {max_latency:.0f}ms"
            return False, f"High latency - Avg: {avg_latency:.0f}ms"
        return False, "No successful requests"
    
    # ==================== DATA VALIDATION TESTS ====================
    
    def test_input_validation(self):
        """Test input validation"""
        invalid_cases = [
            {"machine_id": "TEST"},  # Missing required fields
            {"machine_id": "TEST", "machine_type": "INVALID", "air_temperature": 300},  # Invalid machine type
        ]
        
        rejected = 0
        for case in invalid_cases:
            try:
                resp = requests.post(
                    f"{BACKEND_URL}/api/predict/quick",
                    json=case,
                    timeout=10
                )
                if resp.status_code in [400, 422]:  # Validation error
                    rejected += 1
            except:
                pass
        
        if rejected == len(invalid_cases):
            return True, "Invalid inputs correctly rejected"
        return False, f"Only {rejected}/{len(invalid_cases)} invalid inputs rejected"
    
    def test_output_format(self):
        """Test that output has correct format"""
        test_data = {
            "machine_id": "FORMAT-TEST",
            "machine_type": "M",
            "air_temperature": 300.0,
            "process_temperature": 310.0,
            "rotational_speed": 1500,
            "torque": 40.0,
            "tool_wear": 100
        }
        
        required_fields = ["machine_id", "failure_probability", "risk_level"]
        
        try:
            resp = requests.post(
                f"{BACKEND_URL}/api/predict/quick",
                json=test_data,
                timeout=10
            )
            if resp.status_code == 200:
                data = resp.json()
                missing = [f for f in required_fields if f not in data]
                if len(missing) == 0:
                    return True, "All required fields present"
                return False, f"Missing fields: {missing}"
            return False, f"Status code: {resp.status_code}"
        except Exception as e:
            return False, str(e)
    
    # ==================== RUN ALL TESTS ====================
    
    def run_all(self):
        """Run all integration tests"""
        self.start_time = datetime.now()
        
        print()
        color_print("╔══════════════════════════════════════════════════════════╗", Colors.BLUE)
        color_print("║      ENTERPRISE PREDICTIVE MAINTENANCE - INTEGRATION     ║", Colors.BLUE)
        color_print("║                     TEST SUITE                           ║", Colors.BLUE)
        color_print(f"║      {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}                              ║", Colors.BLUE)
        color_print("╚══════════════════════════════════════════════════════════╝", Colors.BLUE)
        
        # Service Availability
        print_section("SERVICE AVAILABILITY")
        self.run_test("Backend API Available", self.test_backend_available)
        self.run_test("Frontend Available", self.test_frontend_available)
        
        # Check if we should continue
        backend_ok = any(r.passed for r in self.results if "Backend" in r.name)
        if not backend_ok:
            color_print("\n  ⚠️  Backend not available - skipping remaining tests", Colors.YELLOW)
            self.print_summary()
            return False
        
        # ML Pipeline
        print_section("ML PIPELINE")
        self.run_test("ML Model Loaded", self.test_model_loaded)
        self.run_test("Prediction Accuracy", self.test_prediction_accuracy)
        self.run_test("Feature Importance", self.test_feature_importance)
        
        # Knowledge Base
        print_section("KNOWLEDGE BASE")
        self.run_test("Knowledge Base Populated", self.test_knowledge_base_populated)
        self.run_test("Knowledge Query", self.test_knowledge_query)
        
        # API Endpoints
        print_section("API ENDPOINTS")
        self.run_test("Batch Processing", self.test_batch_processing)
        self.run_test("Analysis Endpoint", self.test_analysis_endpoint)
        self.run_test("Recommendations Quality", self.test_recommendations_quality)
        
        # Performance
        print_section("PERFORMANCE")
        self.run_test("Concurrent Requests", self.test_concurrent_requests)
        self.run_test("Response Latency", self.test_response_latency)
        
        # Data Validation
        print_section("DATA VALIDATION")
        self.run_test("Input Validation", self.test_input_validation)
        self.run_test("Output Format", self.test_output_format)
        
        self.print_summary()
        
        return all(r.passed for r in self.results)
    
    def print_summary(self):
        """Print test summary"""
        print_section("TEST SUMMARY")
        
        passed = sum(1 for r in self.results if r.passed)
        failed = len(self.results) - passed
        total_time = sum(r.duration_ms for r in self.results)
        
        print(f"\n  Total Tests:    {len(self.results)}")
        color_print(f"  Passed:         {passed}", Colors.GREEN)
        if failed > 0:
            color_print(f"  Failed:         {failed}", Colors.RED)
        else:
            print(f"  Failed:         {failed}")
        print(f"  Success Rate:   {passed/len(self.results)*100:.1f}%")
        print(f"  Total Time:     {total_time:.0f}ms")
        
        if failed > 0:
            print(f"\n  Failed Tests:")
            for r in self.results:
                if not r.passed:
                    color_print(f"    - {r.name}: {r.details}", Colors.RED)
        
        print()
        if passed == len(self.results):
            color_print("  ✨ ALL TESTS PASSED! System is fully operational.", Colors.GREEN)
        elif passed >= len(self.results) * 0.8:
            color_print("  ⚠️  Most tests passed. Minor issues detected.", Colors.YELLOW)
        else:
            color_print("  ❌ Multiple tests failed. System needs attention.", Colors.RED)
        
        print()
        color_print("━" * 60, Colors.CYAN)


def main():
    """Main entry point"""
    tester = IntegrationTester()
    success = tester.run_all()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
