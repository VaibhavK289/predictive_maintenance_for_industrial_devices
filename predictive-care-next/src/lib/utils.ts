import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num);
}

export function formatPercentage(num: number): string {
  return `${(num * 100).toFixed(1)}%`;
}

export function getRiskColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case "critical":
      return "text-red-500";
    case "high":
      return "text-orange-500";
    case "medium":
      return "text-yellow-500";
    case "low":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
}

export function getRiskBgColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case "critical":
      return "bg-red-500/20 border-red-500/50";
    case "high":
      return "bg-orange-500/20 border-orange-500/50";
    case "medium":
      return "bg-yellow-500/20 border-yellow-500/50";
    case "low":
      return "bg-green-500/20 border-green-500/50";
    default:
      return "bg-gray-500/20 border-gray-500/50";
  }
}
