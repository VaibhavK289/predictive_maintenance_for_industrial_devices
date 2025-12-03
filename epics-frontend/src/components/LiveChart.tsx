import React, { useState, useEffect } from 'react';
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
  ChartData
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataPoint {
  id: number;
  prediction_score: number;
  prediction_label: number;
  // Include other properties if needed
}

const LiveChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
        const response = await fetch(apiUrl ?? '/api/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // If data is an array, use it directly; if it's a single object, wrap it in an array
        const dataArray = Array.isArray(data) ? data : [data];
        
        // Extract labels (ids) and prediction scores
        const labels = dataArray.map((item: DataPoint) => String(item?.id ?? ''));
        const scores = dataArray.map((item: DataPoint) => {
          const val = (item as any)?.prediction_score;
          return typeof val === 'number' && isFinite(val) ? val : 0;
        });
        
        setChartData({
          labels,
          datasets: [
            {
              label: 'Prediction Score',
              data: scores,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              tension: 0.1
            }
          ]
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up polling if you want to update the chart periodically
    const intervalId = setInterval(fetchData, 5000); // Fetch every 5 seconds
    
    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Prediction Score by ID',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1, // Since prediction_score is likely between 0 and 1
        title: {
          display: true,
          text: 'Prediction Score'
        }
      },
      x: {
        title: {
          display: true,
          text: 'ID'
        }
      }
    }
  };

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div className="chart-container" style={{ width: '80%', margin: '0 auto' }}>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default LiveChart;