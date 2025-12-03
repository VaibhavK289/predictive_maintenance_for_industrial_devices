"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DataPoint {
  time: string;
  value: number;
  timestamp: number;
}

interface LiveLineChartProps {
  className?: string;
  title?: string;
  label?: string;
  unit?: string;
  color?: string;
  minValue?: number;
  maxValue?: number;
  height?: number;
  yAxisDomain?: [number, number];
  dataPoints?: number;
  updateInterval?: number;
  valueGenerator?: () => number;
}

export function LiveLineChart({
  className,
  title = "Live Data",
  label,
  unit = "",
  color = "#22d3ee",
  minValue = 0,
  maxValue = 100,
  height = 150,
  yAxisDomain,
  dataPoints = 20,
  updateInterval = 1000,
  valueGenerator,
}: LiveLineChartProps) {
  const [data, setData] = useState<DataPoint[]>([]);

  const effectiveMinValue = yAxisDomain ? yAxisDomain[0] : minValue;
  const effectiveMaxValue = yAxisDomain ? yAxisDomain[1] : maxValue;
  const displayTitle = label || title;

  const generateValue = useCallback(() => {
    if (valueGenerator) return valueGenerator();
    return Math.random() * (effectiveMaxValue - effectiveMinValue) + effectiveMinValue;
  }, [valueGenerator, effectiveMinValue, effectiveMaxValue]);

  useEffect(() => {
    // Initialize data
    const initialData: DataPoint[] = [];
    const now = Date.now();
    for (let i = dataPoints; i >= 0; i--) {
      initialData.push({
        time: new Date(now - i * updateInterval).toLocaleTimeString(),
        value: generateValue(),
        timestamp: now - i * updateInterval,
      });
    }
    setData(initialData);

    // Update data periodically
    const interval = setInterval(() => {
      const newTimestamp = Date.now();
      setData((prevData) => {
        const newData = [
          ...prevData.slice(1),
          {
            time: new Date(newTimestamp).toLocaleTimeString(),
            value: generateValue(),
            timestamp: newTimestamp,
          },
        ];
        return newData;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [generateValue, dataPoints, updateInterval]);

  const currentValue = data.length > 0 ? data[data.length - 1].value : 0;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">{displayTitle}</span>
        <motion.span
          key={currentValue}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-2xl font-bold text-white tabular-nums"
        >
          {currentValue.toFixed(1)}
          <span className="text-sm text-gray-400 ml-1">{unit}</span>
        </motion.span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${displayTitle}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
            stroke="rgba(255,255,255,0.3)"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[effectiveMinValue, effectiveMaxValue]}
            stroke="rgba(255,255,255,0.3)"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(17, 24, 39, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
            labelStyle={{ color: "#9ca3af" }}
            itemStyle={{ color: color }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${displayTitle})`}
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface MultiLineChartProps {
  className?: string;
  title?: string;
  lines: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  height?: number;
  dataPoints?: number;
  updateInterval?: number;
}

export function MultiLineChart({
  className,
  title = "Multi-Line Chart",
  lines,
  height = 200,
  dataPoints = 20,
  updateInterval = 1000,
}: MultiLineChartProps) {
  const [data, setData] = useState<Array<Record<string, number | string>>>([]);

  useEffect(() => {
    // Initialize data
    const initialData: Array<Record<string, number | string>> = [];
    const now = Date.now();
    for (let i = dataPoints; i >= 0; i--) {
      const point: Record<string, number | string> = {
        time: new Date(now - i * updateInterval).toLocaleTimeString(),
      };
      lines.forEach((line) => {
        point[line.key] = Math.random() * 100;
      });
      initialData.push(point);
    }
    setData(initialData);

    // Update data periodically
    const interval = setInterval(() => {
      setData((prevData) => {
        const newPoint: Record<string, number | string> = {
          time: new Date().toLocaleTimeString(),
        };
        lines.forEach((line) => {
          const lastValue = prevData[prevData.length - 1]?.[line.key] as number || 50;
          const change = (Math.random() - 0.5) * 10;
          newPoint[line.key] = Math.max(0, Math.min(100, lastValue + change));
        });
        return [...prevData.slice(1), newPoint];
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [lines, dataPoints, updateInterval]);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">{title}</span>
        <div className="flex gap-4">
          {lines.map((line) => (
            <div key={line.key} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: line.color }}
              />
              <span className="text-xs text-gray-400">{line.name}</span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
            stroke="rgba(255,255,255,0.3)"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="rgba(255,255,255,0.3)"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(17, 24, 39, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
            labelStyle={{ color: "#9ca3af" }}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
