'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Bell, AlertTriangle, CheckCircle } from 'lucide-react';

const alerts = [
  {
    id: 1,
    title: 'High Temperature Warning',
    message: 'Machine H1 temperature exceeds normal range',
    severity: 'warning' as const,
    time: '5 minutes ago',
  },
  {
    id: 2,
    title: 'Maintenance Required',
    message: 'Tool wear at 65% - schedule maintenance',
    severity: 'error' as const,
    time: '15 minutes ago',
  },
  {
    id: 3,
    title: 'Performance Degradation',
    message: 'Rotation speed fluctuation detected',
    severity: 'warning' as const,
    time: '1 hour ago',
  },
  {
    id: 4,
    title: 'System Update',
    message: 'ML model successfully updated',
    severity: 'success' as const,
    time: '2 hours ago',
  },
];

const severityConfig = {
  error: {
    bg: 'bg-red-50',
    border: 'border-red-100',
    icon: AlertCircle,
    iconColor: 'text-red-500',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
  },
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    icon: CheckCircle,
    iconColor: 'text-emerald-500',
  },
};

export default function AlertPanel() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Active Alerts</h2>
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-400" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
              {alerts.filter(a => a.severity !== 'success').length}
            </span>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
        {alerts.map((alert, index) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 ${config.bg} border-l-4 ${config.border} hover:bg-opacity-75 transition-colors cursor-pointer`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`h-5 w-5 ${config.iconColor} mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {alert.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-0.5">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{alert.time}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700">
          View All Alerts →
        </button>
      </div>
    </div>
  );
}
