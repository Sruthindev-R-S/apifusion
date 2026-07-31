/**
 * @fileoverview PostgreSQL Connection Pool & Table Auto-Initialization for apifusion database.
 */

const { Pool } = require('pg');
const config = require('./env');
const seedMovies = require('./seedMovies');

const pool = new Pool({
  host: config.PGHOST,
  port: config.PGPORT,
  user: config.PGUSER,
  password: config.PGPASSWORD,
  database: config.PGDATABASE,
  connectionTimeoutMillis: 2000,
});

let isDbConnected = false;

// Auto-create database table `movie_references` and seed featured movies
async function initDatabase() {
  try {
    const client = await pool.connect();
    isDbConnected = true;
    console.log(`🐘 [POSTGRESQL] Connected to database "${config.PGDATABASE}" on ${config.PGHOST}:${config.PGPORT}`);

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS movie_references (
        id SERIAL PRIMARY KEY,
        movie_name VARCHAR(255) UNIQUE NOT NULL,
        tmdb_id INTEGER NOT NULL,
        poster_path TEXT,
        backdrop_path TEXT,
        overview TEXT,
        vote_average NUMERIC(3, 1),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createTableQuery);
    console.log('✅ [POSTGRESQL] Table "movie_references" (movie_name, tmdb_id) ready.');

    // Seed featured movies into PostgreSQL DB table
    for (const m of seedMovies) {
      const seedQuery = `
        INSERT INTO movie_references (movie_name, tmdb_id, poster_path, backdrop_path, overview, vote_average)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (movie_name) DO UPDATE 
        SET tmdb_id = EXCLUDED.tmdb_id,
            poster_path = EXCLUDED.poster_path,
            backdrop_path = EXCLUDED.backdrop_path,
            overview = EXCLUDED.overview,
            vote_average = EXCLUDED.vote_average;
      `;
      await client.query(seedQuery, [m.movie_name, m.tmdb_id, m.poster_path, m.backdrop_path, m.overview, m.vote_average]);
    }
    console.log(`🌱 [POSTGRESQL] Seeded ${seedMovies.length} featured movies into "movie_references" table.`);

    client.release();
  } catch (error) {
    isDbConnected = false;
    console.warn(`⚠️ [POSTGRESQL] Database connection notice (${error.message}). Will use in-memory seedMovies registry until credentials are configured in backend/.env.`);
  }
}

// Attempt initial connection on server boot
initDatabase();

module.exports = {
  pool,
  isDbConnected: () => isDbConnected,
  query: (text, params) => pool.query(text, params)
};
