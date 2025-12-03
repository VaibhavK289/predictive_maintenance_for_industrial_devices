'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Activity, Thermometer, RotateCw, Wrench, Wind, RefreshCw } from 'lucide-react';
import MachineStatus from '@/components/dashboard/MachineStatus';
import LiveChart from '@/components/dashboard/LiveChart';
import AlertPanel from '@/components/dashboard/AlertPanel';
import MachineSelector from '@/components/dashboard/MachineSelector';
import DataTable from '@/components/dashboard/DataTable';

export default function Dashboard() {
  const [selectedMachine, setSelectedMachine] = useState('Machine-H1');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Machine Dashboard</h1>
                <p className="text-sm text-gray-500">Real-time monitoring and analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MachineSelector
                selectedMachine={selectedMachine}
                onMachineChange={setSelectedMachine}
              />
              <button className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MachineStatus
            title="Machine Status"
            value="Operational"
            icon={Activity}
            status="success"
            trend="All systems running"
          />
          <MachineStatus
            title="Temperature"
            value="45.2°C"
            icon={Thermometer}
            status="warning"
            trend="↑ 2.1°C from avg"
          />
          <MachineStatus
            title="Rotation Speed"
            value="1750 RPM"
            icon={RotateCw}
            status="success"
            trend="Within normal range"
          />
          <MachineStatus
            title="Tool Wear"
            value="65%"
            icon={Wrench}
            status="warning"
            trend="Maintenance in 35h"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Prediction Score Trend</h2>
                  <p className="text-sm text-gray-500">Machine failure prediction over time</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Live Updates</span>
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>
              <LiveChart />
            </motion.div>

            {/* Data Table */}
            <DataTable />

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-medium">Air Temperature</span>
                    <Thermometer className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">24.5°C</p>
                  <p className="text-xs text-gray-500 mt-1">Normal range</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-orange-600 font-medium">Process Temp</span>
                    <Thermometer className="h-4 w-4 text-orange-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">45.2°C</p>
                  <p className="text-xs text-amber-600 mt-1">Above average</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-600 font-medium">Torque</span>
                    <Wind className="h-4 w-4 text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">35.8 Nm</p>
                  <p className="text-xs text-gray-500 mt-1">Optimal</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-red-600 font-medium">Tool Wear</span>
                    <Wrench className="h-4 w-4 text-red-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">65%</p>
                  <p className="text-xs text-red-600 mt-1">Schedule maintenance</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Alerts Panel */}
          <div className="lg:col-span-1">
            <AlertPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
