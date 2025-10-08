// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required for Neon
});

// Global error handler for idle clients
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error on idle client', err);
});

console.log('✅ PostgreSQL pool created');

module.exports = pool;
