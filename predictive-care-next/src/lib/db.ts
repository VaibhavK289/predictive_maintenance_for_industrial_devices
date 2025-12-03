import { Pool } from 'pg';

// Determine if we're targeting a Neon host and whether to enable TLS.
const isNeonHost = (value: string | undefined) => typeof value === 'string' && value.includes('neon.tech');
const isNeon = isNeonHost(process.env.DATABASE_URL) || isNeonHost(process.env.PG_HOST);
const enableSSL = process.env.PG_SSL === 'true' || isNeon;

const commonPoolOptions = {
  max: Number(process.env.PG_POOL_MAX ?? 10),
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS ?? 10000),
  connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT_MS ?? 10000),
};

let pool: Pool;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: enableSSL ? { rejectUnauthorized: false } : undefined,
    ...commonPoolOptions,
  });
} else {
  pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT) || 5432,
    ssl: enableSSL ? { rejectUnauthorized: false } : undefined,
    ...commonPoolOptions,
  });
}

export default pool;

export interface ProcessData {
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

export async function getAllData(): Promise<ProcessData[]> {
  const { rows } = await pool.query("SELECT * FROM process_data ORDER BY id DESC LIMIT 100");
  return rows;
}

export async function getLatestData(): Promise<ProcessData | null> {
  const { rows } = await pool.query("SELECT * FROM process_data ORDER BY id DESC LIMIT 1");
  return rows[0] || null;
}

export async function getStats() {
  const totalResult = await pool.query("SELECT COUNT(*) as total FROM process_data");
  const failuresResult = await pool.query("SELECT COUNT(*) as failures FROM process_data WHERE prediction_label = 1");
  const avgScoreResult = await pool.query("SELECT AVG(prediction_score) as avg_score FROM process_data");
  
  return {
    totalRecords: parseInt(totalResult.rows[0].total),
    failures: parseInt(failuresResult.rows[0].failures),
    avgPredictionScore: parseFloat(avgScoreResult.rows[0].avg_score) || 0,
  };
}

export async function recordExists(record: Partial<ProcessData>): Promise<boolean> {
  const result = await pool.query(
    `SELECT 1 FROM process_data 
     WHERE type_h = $1 AND type_l = $2 AND type_m = $3 
       AND tool_wear = $4 AND rotation_speed = $5 AND torque = $6 
       AND air_temp = $7 AND process_temp = $8 AND temp_diff = $9 
       AND power = $10 AND prediction_label = $11 AND prediction_score = $12`,
    [
      record.type_h,
      record.type_l,
      record.type_m,
      record.tool_wear,
      record.rotation_speed,
      record.torque,
      record.air_temp,
      record.process_temp,
      record.temp_diff,
      record.power,
      record.prediction_label,
      record.prediction_score
    ]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function insertRecord(record: Partial<ProcessData>): Promise<void> {
  await pool.query(
    `INSERT INTO process_data 
      (type_h, type_l, type_m, tool_wear, rotation_speed, torque, air_temp, process_temp, temp_diff, power, prediction_label, prediction_score) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      record.type_h,
      record.type_l,
      record.type_m,
      record.tool_wear,
      record.rotation_speed,
      record.torque,
      record.air_temp,
      record.process_temp,
      record.temp_diff,
      record.power,
      record.prediction_label,
      record.prediction_score
    ]
  );
}
