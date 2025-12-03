import pool from './pool.js';

export async function getAllData() {
  const { rows } = await pool.query("SELECT * FROM process_data");
  return rows;
}

export async function recordExists(record) {
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
  return result.rowCount > 0;
}

export async function insertRecord(record) {
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
