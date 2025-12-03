"use client";

import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  pulse?: boolean;
}

export function Badge({
  className,
  variant = "default",
  pulse = false,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-gray-500/20 text-gray-300 border-gray-500/50",
    success: "bg-green-500/20 text-green-400 border-green-500/50",
    warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    danger: "bg-red-500/20 text-red-400 border-red-500/50",
    info: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
    outline: "bg-transparent text-gray-300 border-white/20",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
        variants[variant],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              variant === "success" && "bg-green-400",
              variant === "warning" && "bg-yellow-400",
              variant === "danger" && "bg-red-400",
              variant === "info" && "bg-cyan-400",
              variant === "default" && "bg-gray-400"
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              variant === "success" && "bg-green-500",
              variant === "warning" && "bg-yellow-500",
              variant === "danger" && "bg-red-500",
              variant === "info" && "bg-cyan-500",
              variant === "default" && "bg-gray-500"
            )}
          />
        </span>
      )}
      {props.children}
    </div>
  );
}
