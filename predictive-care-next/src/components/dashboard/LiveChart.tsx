'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DataPoint {
  id: number;
  prediction_score: number;
  prediction_label: number;
}

export default function LiveChart() {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
      tension: number;
      pointRadius: number;
      pointHoverRadius: number;
    }[];
  }>({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sensors');
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        
        const dataArray = Array.isArray(data) ? data.slice(-20) : [data];
        
        const labels = dataArray.map((item: DataPoint) => `#${item?.id ?? ''}`);
        const scores = dataArray.map((item: DataPoint) => {
          const val = item?.prediction_score;
          return typeof val === 'number' && isFinite(val) ? val : 0;
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Prediction Score',
              data: scores,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Score: ${(context.raw as number * 100).toFixed(1)}%`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return `${(Number(value) * 100).toFixed(0)}%`;
          },
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-80"
    >
      <Line options={options} data={chartData} />
    </motion.div>
  );
}
