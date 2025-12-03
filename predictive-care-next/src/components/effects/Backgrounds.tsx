"use client";

import { cn } from "@/lib/utils";

interface GlowOrbProps {
  className?: string;
  color?: "cyan" | "purple" | "pink" | "orange" | "green";
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
}

export function GlowOrb({
  className,
  color = "cyan",
  size = "md",
  animate = true,
}: GlowOrbProps) {
  const colors = {
    cyan: "from-cyan-500/30 via-cyan-500/10 to-transparent",
    purple: "from-purple-500/30 via-purple-500/10 to-transparent",
    pink: "from-pink-500/30 via-pink-500/10 to-transparent",
    orange: "from-orange-500/30 via-orange-500/10 to-transparent",
    green: "from-green-500/30 via-green-500/10 to-transparent",
  };

  const sizes = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
    xl: "w-[500px] h-[500px]",
  };

  return (
    <div
      className={cn(
        "absolute rounded-full bg-gradient-radial blur-3xl",
        colors[color],
        sizes[size],
        animate && "animate-pulse-slow",
        className
      )}
    />
  );
}

interface GridBackgroundProps {
  className?: string;
}

export function GridBackground({ className }: GridBackgroundProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]",
        className
      )}
    />
  );
}

interface SpotlightProps {
  className?: string;
}

export function Spotlight({ className }: SpotlightProps) {
  return (
    <div
      className={cn(
        "absolute pointer-events-none",
        "w-[800px] h-[800px]",
        "bg-gradient-radial from-cyan-500/20 via-transparent to-transparent",
        "blur-3xl",
        className
      )}
    />
  );
}

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  borderClassName?: string;
}

export function GradientBorder({
  children,
  className,
  borderClassName,
}: GradientBorderProps) {
  return (
    <div className={cn("relative p-[1px] rounded-2xl", className)}>
      <div
        className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500",
          borderClassName
        )}
      />
      <div className="relative rounded-2xl bg-gray-900">{children}</div>
    </div>
  );
}
