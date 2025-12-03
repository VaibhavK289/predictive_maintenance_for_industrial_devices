'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface MachineStatusProps {
  title: string;
  value: string;
  icon: LucideIcon;
  status: 'success' | 'warning' | 'error';
  trend?: string;
}

const statusConfig = {
  success: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    border: 'border-emerald-100',
    glow: 'shadow-emerald-100',
  },
  warning: {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    border: 'border-amber-100',
    glow: 'shadow-amber-100',
  },
  error: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    border: 'border-red-100',
    glow: 'shadow-red-100',
  },
};

export default function MachineStatus({ title, value, icon: Icon, status, trend }: MachineStatusProps) {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden bg-white rounded-2xl border ${config.border} p-6 shadow-lg ${config.glow} hover:shadow-xl transition-all duration-300`}
    >
      {/* Decorative gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${config.bg} rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2`} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${status === 'success' ? 'text-emerald-600' : status === 'warning' ? 'text-amber-600' : 'text-red-600'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`${config.iconBg} p-3 rounded-xl`}>
          <Icon className={`h-6 w-6 ${config.iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
}
