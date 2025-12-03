import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Determine if we're targeting a Neon host and whether to enable TLS.
const isNeonHost = (value) => typeof value === 'string' && value.includes('neon.tech');
const isNeon = isNeonHost(process.env.DATABASE_URL) || isNeonHost(process.env.PG_HOST);
const enableSSL = process.env.PG_SSL === 'true' || isNeon;

const commonPoolOptions = {
  max: Number(process.env.PG_POOL_MAX ?? 10),
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS ?? 10000),
  connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT_MS ?? 10000),
  keepAlive: true,
};

let pool;

if (process.env.DATABASE_URL) {
  // Prefer a single connection string (use Neon "Pooled" URL if available)
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: enableSSL ? { rejectUnauthorized: false } : undefined,
    ...commonPoolOptions,
  });
} else {
  // Fall back to discrete PG_* variables
  pool = new pg.Pool({
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