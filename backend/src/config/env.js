/**
 * @fileoverview Loads and exports application configuration from environment variables.
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 3000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173', // React app URL

  // GitHub OAuth configuration
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,

  // TMDB configuration
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  API_READ_ACCESS_TOKEN: process.env.API_READ_ACCESS_TOKEN,

  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET,

  // PostgreSQL Database Configuration
  PGHOST: process.env.PGHOST || 'localhost',
  PGPORT: parseInt(process.env.PGPORT, 10) || 5432,
  PGUSER: process.env.PGUSER || 'postgres',
  PGPASSWORD: process.env.PGPASSWORD || '',
  PGDATABASE: process.env.PGDATABASE || 'apifusion',
};
