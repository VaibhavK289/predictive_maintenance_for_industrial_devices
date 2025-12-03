'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Icons for future trend indicators

interface DataPoint {
  id: number;
  type_h: number;
  type_l: number;
  type_m: number;
  tool_wear: number;
  rotation_speed: number;
  torque: number;
  air_temp: number;
  process_temp: number;
  temp_diff: number;
  power: number;
  prediction_label: number;
  prediction_score: number;
}

export default function DataTable() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/sensors');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        const dataArray = Array.isArray(result) ? result : [result];
        setData(dataArray.slice(0, 10));
        setError(null);
      } catch (err) {
        setError(`Failed to fetch data: ${err instanceof Error ? err.message : String(err)}`);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading && data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500">Loading sensor data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-12">
        <div className="text-center text-red-600">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Machine Data</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Live Updates</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tool Wear</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rotation</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Torque</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Air Temp</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Process Temp</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Power</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono text-sm font-medium text-gray-900">#{item.id}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{item.tool_wear}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{item.rotation_speed} RPM</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{item.torque} Nm</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{item.air_temp}°C</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{item.process_temp}°C</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {typeof item.power === 'number' && isFinite(item.power) ? item.power.toFixed(2) : '—'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.prediction_label === 1 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {item.prediction_label === 1 ? 'Failure Risk' : 'Normal'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 w-24">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            item.prediction_score > 0.75 ? 'bg-red-500' :
                            item.prediction_score > 0.5 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${(item.prediction_score || 0) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-12 text-right">
                      {((item.prediction_score || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
