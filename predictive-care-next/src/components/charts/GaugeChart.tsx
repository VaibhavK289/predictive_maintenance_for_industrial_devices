"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GaugeChartProps {
  value: number;
  max?: number;
  maxValue?: number;
  label?: string;
  unit?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
  thresholds?: {
    warning: number;
    danger: number;
  };
}

export function GaugeChart({
  value,
  max,
  maxValue = 100,
  label,
  unit = "%",
  size = "md",
  className,
  color,
  thresholds = { warning: 60, danger: 80 },
}: GaugeChartProps) {
  const maximum = max ?? maxValue;
  const percentage = Math.min((value / maximum) * 100, 100);
  const rotation = (percentage / 100) * 180 - 90;

  const getColor = () => {
    if (color) return color;
    if (percentage >= thresholds.danger) return "#ef4444";
    if (percentage >= thresholds.warning) return "#f59e0b";
    return "#22d3ee";
  };

  const sizes = {
    sm: { width: 120, strokeWidth: 8, fontSize: "text-xl" },
    md: { width: 180, strokeWidth: 10, fontSize: "text-3xl" },
    lg: { width: 240, strokeWidth: 12, fontSize: "text-4xl" },
  };

  const config = sizes[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = radius * Math.PI;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg
        width={config.width}
        height={config.width / 2 + 20}
        viewBox={`0 0 ${config.width} ${config.width / 2 + 20}`}
      >
        {/* Background arc */}
        <path
          d={`M ${config.strokeWidth / 2} ${config.width / 2} A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${config.width / 2}`}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id={`gauge-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Value arc */}
        <motion.path
          d={`M ${config.strokeWidth / 2} ${config.width / 2} A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${config.width / 2}`}
          fill="none"
          stroke={getColor()}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference - (percentage / 100) * circumference,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 10px ${getColor()})`,
          }}
        />

        {/* Needle */}
        <motion.g
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: `${config.width / 2}px ${config.width / 2}px` }}
        >
          <line
            x1={config.width / 2}
            y1={config.width / 2}
            x2={config.width / 2}
            y2={config.strokeWidth + 10}
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </motion.g>

        {/* Center circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={8}
          fill="white"
        />
      </svg>

      {/* Value display */}
      <div className="text-center -mt-2">
        <motion.div
          key={value}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("font-bold text-white tabular-nums", config.fontSize)}
        >
          {value.toFixed(1)}
          <span className="text-gray-400 text-sm ml-1">{unit}</span>
        </motion.div>
        {label && <div className="text-gray-400 text-sm mt-1">{label}</div>}
      </div>
    </div>
  );
}

interface RadialProgressProps {
  value: number;
  max?: number;
  maxValue?: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  showValue?: boolean;
}

export function RadialProgress({
  value,
  max,
  maxValue = 100,
  label,
  size = 120,
  strokeWidth = 10,
  className,
  color = "#22d3ee",
  showValue = true,
}: RadialProgressProps) {
  const maximum = max ?? maxValue;
  const percentage = Math.min((value / maximum) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <motion.span
            key={value}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl font-bold text-white tabular-nums"
          >
            {percentage.toFixed(0)}%
          </motion.span>
        )}
        {label && <span className="text-xs text-gray-400 mt-1">{label}</span>}
      </div>
    </div>
  );
}

interface StatusIndicatorProps {
  status: "healthy" | "warning" | "critical" | "offline" | "operational" | "degraded";
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusIndicator({
  status,
  label,
  className,
  size = "md",
}: StatusIndicatorProps) {
  const colors: Record<string, { bg: string; ring: string; text: string }> = {
    healthy: { bg: "bg-green-500", ring: "ring-green-500", text: "text-green-400" },
    operational: { bg: "bg-green-500", ring: "ring-green-500", text: "text-green-400" },
    warning: { bg: "bg-yellow-500", ring: "ring-yellow-500", text: "text-yellow-400" },
    degraded: { bg: "bg-yellow-500", ring: "ring-yellow-500", text: "text-yellow-400" },
    critical: { bg: "bg-red-500", ring: "ring-red-500", text: "text-red-400" },
    offline: { bg: "bg-gray-500", ring: "ring-gray-500", text: "text-gray-400" },
  };

  const sizes = {
    sm: { dot: "w-2 h-2", text: "text-xs" },
    md: { dot: "w-3 h-3", text: "text-sm" },
    lg: { dot: "w-4 h-4", text: "text-base" },
  };

  const config = colors[status] || colors.offline;
  const sizeConfig = sizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="relative flex">
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
            config.bg,
            status === "offline" && "animate-none"
          )}
        />
        <span
          className={cn("relative inline-flex rounded-full", sizeConfig.dot, config.bg)}
        />
      </span>
      {label && (
        <span className={cn("capitalize", sizeConfig.text, config.text)}>
          {label || status}
        </span>
      )}
    </div>
  );
}
