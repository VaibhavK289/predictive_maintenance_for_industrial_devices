"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Activity,
  Thermometer,
  RotateCw,
  Wrench,
  Wind,
  RefreshCw,
  Brain,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  TrendingUp,
  Bell,
  ChevronRight,
  Gauge,
  Cpu,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlowOrb, GridBackground } from "@/components/effects/Backgrounds";
import { AnimatedCounter, FadeIn, PulseRing } from "@/components/effects/Animations";
import { LiveLineChart, MultiLineChart } from "@/components/charts/LiveCharts";
import { GaugeChart, RadialProgress, StatusIndicator } from "@/components/charts/GaugeChart";
import { MLModelVisualizer, NeuralNetwork } from "@/components/ml/MLModelVisualizer";
import { cn } from "@/lib/utils";

// Types
interface SensorData {
  timestamp: Date;
  temperature: number;
  processTemp: number;
  rotationalSpeed: number;
  torque: number;
  toolWear: number;
  airTemperature: number;
}

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
}

interface MLPrediction {
  probability: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  confidence: number;
  features: { name: string; importance: number }[];
  recommendation: string;
}

// Status Card Component
function StatusCard({
  title,
  value,
  unit,
  icon: Icon,
  status,
  trend,
  sparkline,
}: {
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ElementType;
  status: "success" | "warning" | "critical";
  trend?: string;
  sparkline?: number[];
}) {
  const statusColors = {
    success: "from-emerald-500 to-teal-500",
    warning: "from-amber-500 to-orange-500",
    critical: "from-red-500 to-rose-500",
  };

  const bgColors = {
    success: "bg-emerald-500/10 border-emerald-500/20",
    warning: "bg-amber-500/10 border-amber-500/20",
    critical: "bg-red-500/10 border-red-500/20",
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card variant="glass" className="relative overflow-hidden">
        <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", statusColors[status])} />
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={cn("p-3 rounded-xl border", bgColors[status])}>
              <Icon className={cn("h-5 w-5", status === "success" ? "text-emerald-400" : status === "warning" ? "text-amber-400" : "text-red-400")} />
            </div>
            {status === "critical" && (
              <Badge variant="destructive" pulse className="text-xs">
                Critical
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">
              {typeof value === "number" ? <AnimatedCounter from={0} to={value} duration={1} decimals={1} /> : value}
            </span>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>
          {trend && (
            <p className={cn("text-xs mt-2", status === "success" ? "text-emerald-400" : status === "warning" ? "text-amber-400" : "text-red-400")}>
              {trend}
            </p>
          )}
          {sparkline && (
            <div className="h-8 flex items-end gap-0.5 mt-3">
              {sparkline.map((v, i) => (
                <div
                  key={i}
                  className={cn("flex-1 rounded-t", status === "success" ? "bg-emerald-500/50" : status === "warning" ? "bg-amber-500/50" : "bg-red-500/50")}
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Alert Item Component
function AlertItem({ alert }: { alert: Alert }) {
  const icons = {
    critical: XCircle,
    warning: AlertTriangle,
    info: Bell,
  };
  const Icon = icons[alert.type];

  const colors = {
    critical: "text-red-400 bg-red-500/10 border-red-500/20",
    warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    info: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn("flex items-start gap-3 p-4 rounded-xl border", colors[alert.type])}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{alert.title}</p>
        <p className="text-xs text-gray-400 mt-1">{alert.message}</p>
        <p className="text-xs text-gray-500 mt-2">
          {alert.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
}

// Machine Selector
function MachineSelector({
  machines,
  selected,
  onChange,
}: {
  machines: string[];
  selected: string;
  onChange: (machine: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 bg-gray-800/50 rounded-xl p-1 border border-white/10">
      {machines.map((machine) => (
        <button
          key={machine}
          onClick={() => onChange(machine)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            selected === machine
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          {machine}
        </button>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [selectedMachine, setSelectedMachine] = useState("Machine-H1");
  const [isLoading, setIsLoading] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>({
    timestamp: new Date(),
    temperature: 45.2,
    processTemp: 67.8,
    rotationalSpeed: 1750,
    torque: 35.8,
    toolWear: 65,
    airTemperature: 24.5,
  });
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "warning",
      title: "Elevated Temperature",
      message: "Process temperature exceeds normal threshold",
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "info",
      title: "Scheduled Maintenance",
      message: "Tool replacement due in 35 hours",
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);
  const [prediction, setPrediction] = useState<MLPrediction>({
    probability: 23.5,
    riskLevel: "low",
    confidence: 94.2,
    features: [
      { name: "Tool Wear", importance: 0.35 },
      { name: "Temperature", importance: 0.28 },
      { name: "Torque", importance: 0.22 },
      { name: "RPM", importance: 0.15 },
    ],
    recommendation: "Continue monitoring. Schedule maintenance within 72 hours.",
  });

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData((prev) => ({
        timestamp: new Date(),
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        processTemp: prev.processTemp + (Math.random() - 0.5) * 1.5,
        rotationalSpeed: prev.rotationalSpeed + (Math.random() - 0.5) * 20,
        torque: prev.torque + (Math.random() - 0.5) * 1,
        toolWear: Math.min(100, prev.toolWear + Math.random() * 0.1),
        airTemperature: prev.airTemperature + (Math.random() - 0.5) * 0.5,
      }));

      // Randomly update prediction
      if (Math.random() > 0.8) {
        const prob = Math.random() * 100;
        setPrediction((prev) => ({
          ...prev,
          probability: prob,
          riskLevel: prob > 70 ? "critical" : prob > 50 ? "high" : prob > 25 ? "medium" : "low",
          confidence: 90 + Math.random() * 10,
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const machines = ["Machine-H1", "Machine-H2", "Machine-L1", "Machine-M1"];

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Background Effects */}
      <GridBackground className="opacity-30 fixed inset-0" />
      <GlowOrb color="cyan" size="lg" className="fixed top-40 -left-40 opacity-30" />
      <GlowOrb color="purple" size="md" className="fixed bottom-20 -right-20 opacity-30" />

      {/* Header */}
      <div className="sticky top-16 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <PulseRing className="absolute inset-0 scale-150" />
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
                  <Settings className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Machine Dashboard</h1>
                <p className="text-sm text-gray-400">Real-time monitoring & AI predictions</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <MachineSelector
                machines={machines}
                selected={selectedMachine}
                onChange={setSelectedMachine}
              />
              <Button
                variant="outline"
                size="default"
                onClick={handleRefresh}
                className={cn(isLoading && "animate-spin")}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatusCard
            title="Machine Status"
            value="Operational"
            icon={Activity}
            status="success"
            trend="All systems running"
          />
          <StatusCard
            title="Temperature"
            value={sensorData.temperature}
            unit="°C"
            icon={Thermometer}
            status={sensorData.temperature > 50 ? "critical" : sensorData.temperature > 40 ? "warning" : "success"}
            trend={sensorData.temperature > 40 ? "↑ Above normal" : "Normal range"}
            sparkline={[40, 55, 45, 60, 70, 65, 75, 80, 70, 85]}
          />
          <StatusCard
            title="Rotation Speed"
            value={sensorData.rotationalSpeed}
            unit="RPM"
            icon={RotateCw}
            status="success"
            trend="Within normal range"
            sparkline={[60, 65, 70, 68, 72, 75, 73, 78, 80, 75]}
          />
          <StatusCard
            title="Tool Wear"
            value={sensorData.toolWear}
            unit="%"
            icon={Wrench}
            status={sensorData.toolWear > 80 ? "critical" : sensorData.toolWear > 60 ? "warning" : "success"}
            trend={`Maintenance in ${Math.round((100 - sensorData.toolWear) * 2)}h`}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="xl:col-span-2 space-y-8">
            {/* Tabs for different views */}
            <Tabs defaultValue="live" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="live" className="gap-2">
                  <Activity className="h-4 w-4" />
                  Live Sensors
                </TabsTrigger>
                <TabsTrigger value="prediction" className="gap-2">
                  <Brain className="h-4 w-4" />
                  ML Prediction
                </TabsTrigger>
                <TabsTrigger value="analytics" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="live" className="space-y-6">
                {/* Multi-line sensor chart */}
                <Card variant="glass" className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Sensor Readings</h2>
                      <p className="text-sm text-gray-400">Real-time multi-sensor data</p>
                    </div>
                    <Badge variant="success" pulse>
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Live
                      </span>
                    </Badge>
                  </div>
                  <MultiLineChart
                    lines={[
                      { key: "temperature", name: "Temperature", color: "#ef4444" },
                      { key: "torque", name: "Torque", color: "#3b82f6" },
                      { key: "rpm", name: "RPM (÷10)", color: "#10b981" },
                    ]}
                    height={300}
                  />
                </Card>

                {/* Gauges Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card variant="glass" className="p-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Process Temperature</h3>
                    <GaugeChart
                      value={sensorData.processTemp}
                      max={100}
                      unit="°C"
                      label="Process Temp"
                      color={sensorData.processTemp > 80 ? "#ef4444" : sensorData.processTemp > 60 ? "#f59e0b" : "#10b981"}
                    />
                  </Card>
                  <Card variant="glass" className="p-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Torque Load</h3>
                    <GaugeChart
                      value={sensorData.torque}
                      max={60}
                      unit="Nm"
                      label="Torque"
                      color="#3b82f6"
                    />
                  </Card>
                  <Card variant="glass" className="p-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Tool Condition</h3>
                    <GaugeChart
                      value={100 - sensorData.toolWear}
                      max={100}
                      unit="%"
                      label="Health"
                      color={sensorData.toolWear > 70 ? "#ef4444" : sensorData.toolWear > 50 ? "#f59e0b" : "#10b981"}
                    />
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="prediction" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* ML Model Visualizer */}
                  <MLModelVisualizer
                    probability={prediction.probability}
                    riskLevel={prediction.riskLevel}
                    confidence={prediction.confidence}
                    features={prediction.features}
                  />

                  {/* Neural Network Visualization */}
                  <Card variant="glass" className="p-6">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-cyan-400" />
                        Neural Network Architecture
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <NeuralNetwork />
                      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-cyan-400">5</p>
                          <p className="text-xs text-gray-500">Input Features</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-400">3</p>
                          <p className="text-xs text-gray-500">Hidden Layers</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-pink-400">2</p>
                          <p className="text-xs text-gray-500">Output Classes</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendation */}
                <Card variant="gradient" className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <Brain className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">AI Recommendation</h3>
                      <p className="text-gray-400">{prediction.recommendation}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <Button variant="default" size="sm">
                          Schedule Maintenance
                        </Button>
                        <Button variant="ghost" size="sm">
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card variant="glass" className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Prediction Score Trend</h2>
                      <p className="text-sm text-gray-400">Failure probability over last 24 hours</p>
                    </div>
                    <Badge variant="outline">Last 24h</Badge>
                  </div>
                  <LiveLineChart
                    label="Failure Probability"
                    color="#06b6d4"
                    height={300}
                    yAxisDomain={[0, 100]}
                    unit="%"
                  />
                </Card>

                {/* Performance Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card variant="default" className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">MTBF</span>
                      <Clock className="h-4 w-4 text-cyan-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">847h</p>
                    <p className="text-xs text-emerald-400 mt-1">↑ 12% vs last month</p>
                  </Card>
                  <Card variant="default" className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">Uptime</span>
                      <Zap className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">99.7%</p>
                    <p className="text-xs text-emerald-400 mt-1">Target: 99.5%</p>
                  </Card>
                  <Card variant="default" className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">Efficiency</span>
                      <Gauge className="h-4 w-4 text-purple-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">94.2%</p>
                    <p className="text-xs text-amber-400 mt-1">↓ 1.5% today</p>
                  </Card>
                  <Card variant="default" className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">Predictions</span>
                      <Brain className="h-4 w-4 text-pink-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">156</p>
                    <p className="text-xs text-gray-500 mt-1">This week</p>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Alerts & Status */}
          <div className="space-y-6">
            {/* System Status */}
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
              <div className="space-y-4">
                <StatusIndicator label="API Connection" status="operational" />
                <StatusIndicator label="ML Model" status="operational" />
                <StatusIndicator label="Sensor Network" status="operational" />
                <StatusIndicator label="Database" status="operational" />
                <StatusIndicator label="Alert System" status="degraded" />
              </div>
            </Card>

            {/* Prediction Overview */}
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Failure Probability</h3>
              <div className="flex justify-center mb-4">
                <RadialProgress
                  value={prediction.probability}
                  max={100}
                  size={160}
                  strokeWidth={12}
                  color={
                    prediction.riskLevel === "critical"
                      ? "#ef4444"
                      : prediction.riskLevel === "high"
                      ? "#f59e0b"
                      : prediction.riskLevel === "medium"
                      ? "#eab308"
                      : "#10b981"
                  }
                />
              </div>
              <div className="flex justify-center">
                <Badge
                  variant={
                    prediction.riskLevel === "critical"
                      ? "destructive"
                      : prediction.riskLevel === "high"
                      ? "warning"
                      : "success"
                  }
                  pulse={prediction.riskLevel === "critical"}
                >
                  {prediction.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
              <p className="text-sm text-gray-400 text-center mt-4">
                Confidence: {prediction.confidence.toFixed(1)}%
              </p>
            </Card>

            {/* Alerts */}
            <Card variant="glass" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Alerts</h3>
                <Badge variant="outline">{alerts.length}</Badge>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {alerts.map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  ))}
                </AnimatePresence>
              </div>
              <Button variant="ghost" className="w-full mt-4">
                View All Alerts
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Wrench className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Run Diagnostics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
