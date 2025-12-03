import { NextResponse } from 'next/server';
import { getAllData, ProcessData } from '@/lib/db';

// Mock data for development when database is not available
const mockData: ProcessData[] = [
  { id: 1, type_h: 1, type_l: 0, type_m: 0, tool_wear: 45, rotation_speed: 1500, torque: 42.5, air_temp: 298.1, process_temp: 308.6, temp_diff: 10.5, power: 63750, prediction_label: 0, prediction_score: 0.12 },
  { id: 2, type_h: 0, type_l: 1, type_m: 0, tool_wear: 78, rotation_speed: 1420, torque: 45.2, air_temp: 299.5, process_temp: 310.2, temp_diff: 10.7, power: 64184, prediction_label: 0, prediction_score: 0.35 },
  { id: 3, type_h: 0, type_l: 0, type_m: 1, tool_wear: 112, rotation_speed: 1380, torque: 48.9, air_temp: 300.2, process_temp: 312.8, temp_diff: 12.6, power: 67482, prediction_label: 1, prediction_score: 0.78 },
  { id: 4, type_h: 1, type_l: 0, type_m: 0, tool_wear: 25, rotation_speed: 1550, torque: 38.1, air_temp: 297.8, process_temp: 307.2, temp_diff: 9.4, power: 59055, prediction_label: 0, prediction_score: 0.08 },
  { id: 5, type_h: 0, type_l: 1, type_m: 0, tool_wear: 95, rotation_speed: 1400, torque: 50.3, air_temp: 301.1, process_temp: 313.5, temp_diff: 12.4, power: 70420, prediction_label: 1, prediction_score: 0.65 },
  { id: 6, type_h: 1, type_l: 0, type_m: 0, tool_wear: 35, rotation_speed: 1520, torque: 40.2, air_temp: 298.5, process_temp: 308.1, temp_diff: 9.6, power: 61104, prediction_label: 0, prediction_score: 0.15 },
  { id: 7, type_h: 0, type_l: 0, type_m: 1, tool_wear: 88, rotation_speed: 1450, torque: 43.7, air_temp: 299.2, process_temp: 309.8, temp_diff: 10.6, power: 63365, prediction_label: 0, prediction_score: 0.42 },
  { id: 8, type_h: 0, type_l: 1, type_m: 0, tool_wear: 145, rotation_speed: 1320, torque: 55.2, air_temp: 302.4, process_temp: 316.1, temp_diff: 13.7, power: 72864, prediction_label: 1, prediction_score: 0.89 },
  { id: 9, type_h: 1, type_l: 0, type_m: 0, tool_wear: 55, rotation_speed: 1480, torque: 41.8, air_temp: 298.8, process_temp: 308.9, temp_diff: 10.1, power: 61864, prediction_label: 0, prediction_score: 0.22 },
  { id: 10, type_h: 0, type_l: 0, type_m: 1, tool_wear: 120, rotation_speed: 1360, torque: 52.1, air_temp: 301.5, process_temp: 314.2, temp_diff: 12.7, power: 70856, prediction_label: 1, prediction_score: 0.72 },
];

export async function GET() {
  try {
    const data = await getAllData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error, returning mock data:', error);
    // Return mock data when database is unavailable
    return NextResponse.json(mockData);
  }
}

export const dynamic = 'force-dynamic';
