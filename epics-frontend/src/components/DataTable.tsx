import React, { useState, useEffect } from 'react';

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

const DataTable: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Use the exact same URL as in your working LiveChart component
        const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
        const response = await fetch(apiUrl ?? '/api/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Handle both single object or array responses
        const dataArray = Array.isArray(result) ? result : [result];
        setData(dataArray);
        setError(null);
      } catch (err) {
        setError(`Failed to fetch data: ${err instanceof Error ? err.message : String(err)}`);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up polling to refresh data
    const intervalId = setInterval(fetchData, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  if (loading && data.length === 0) {
    return <div className="text-center p-4">Loading data...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            {/* <th className="py-2 px-4 border-b">Type H</th>
            <th className="py-2 px-4 border-b">Type L</th>
            <th className="py-2 px-4 border-b">Type M</th> */}
            <th className="py-2 px-4 border-b">Tool Wear</th>
            <th className="py-2 px-4 border-b">Rotation Speed</th>
            <th className="py-2 px-4 border-b">Torque</th>
            <th className="py-2 px-4 border-b">Air Temp</th>
            <th className="py-2 px-4 border-b">Process Temp</th>
            {/* <th className="py-2 px-4 border-b">Temp Diff</th> */}
            <th className="py-2 px-4 border-b">Power</th>
            <th className="py-2 px-4 border-b">Prediction Label</th>
            <th className="py-2 px-4 border-b">Prediction Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{item.id}</td>
              {/* <td className="py-2 px-4 border-b">{item.type_h}</td>
              <td className="py-2 px-4 border-b">{item.type_l}</td>
              <td className="py-2 px-4 border-b">{item.type_m}</td> */}
              <td className="py-2 px-4 border-b">{item.tool_wear}</td>
              <td className="py-2 px-4 border-b">{item.rotation_speed}</td>
              <td className="py-2 px-4 border-b">{item.torque}</td>
              <td className="py-2 px-4 border-b">{item.air_temp}</td>
              <td className="py-2 px-4 border-b">{item.process_temp}</td>
              {/* <td className="py-2 px-4 border-b">{item.temp_diff}</td> */}
              <td className="py-2 px-4 border-b">{(typeof item.power === 'number' && isFinite(item.power)) ? item.power.toFixed(3) : '—'}</td>
              <td className="py-2 px-4 border-b">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.prediction_label === 1 ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                }`}>
                  {item.prediction_label === 1 ? 'Failure' : 'Normal'}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      (typeof item.prediction_score === 'number' && item.prediction_score > 0.75) ? 'bg-red-600' : 
                      (typeof item.prediction_score === 'number' && item.prediction_score > 0.5) ? 'bg-yellow-400' : 'bg-green-500'
                    }`}
                    style={{ width: `${(typeof item.prediction_score === 'number' && isFinite(item.prediction_score) ? item.prediction_score : 0) * 100}%` }}>
                  </div>
                </div>
                <span className="text-xs mt-1 block">{(() => {
                  const val = (typeof item.prediction_score === 'number' && isFinite(item.prediction_score)) ? item.prediction_score : 0;
                  return `${(val * 100).toFixed(2)}%`;
                })()}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;