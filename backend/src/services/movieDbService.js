/**
 * @fileoverview Service for managing movie_references (movie_name <-> tmdb_id mapping) in PostgreSQL and in-memory registry.
 */

const db = require('../config/db');
const seedMovies = require('../config/seedMovies');

class MovieDbService {
  /**
   * Find movie reference by movie name (checks PostgreSQL first, then seed registry)
   * @param {string} movieName 
   */
  async findMovieByName(movieName) {
    const searchClean = movieName.trim().toLowerCase();

    // 1. Check PostgreSQL DB if connected
    if (db.isDbConnected()) {
      try {
        const res = await db.query(
          'SELECT * FROM movie_references WHERE LOWER(movie_name) = LOWER($1) LIMIT 1',
          [movieName.trim()]
        );
        if (res.rows && res.rows.length > 0) {
          console.log(`🐘 [POSTGRESQL DB HIT] Found movie "${movieName}": TMDB_ID=${res.rows[0].tmdb_id}`);
          return res.rows[0];
        }
      } catch (err) {
        console.warn(`[POSTGRESQL] Find by name notice for "${movieName}":`, err.message);
      }
    }

    // 2. Check seedMovies registry fallback
    const seedMatch = seedMovies.find(m => 
      m.movie_name.toLowerCase() === searchClean ||
      m.movie_name.toLowerCase().includes(searchClean) ||
      searchClean.includes(m.movie_name.toLowerCase())
    );

    if (seedMatch) {
      console.log(`🎯 [SEED REGISTRY HIT] Found movie "${seedMatch.movie_name}": TMDB_ID=${seedMatch.tmdb_id}`);
      return seedMatch;
    }

    return null;
  }

  /**
   * Find movie reference by TMDB ID
   * @param {number} tmdbId 
   */
  async findMovieByTmdbId(tmdbId) {
    if (db.isDbConnected()) {
      try {
        const res = await db.query(
          'SELECT * FROM movie_references WHERE tmdb_id = $1 LIMIT 1',
          [tmdbId]
        );
        if (res.rows && res.rows.length > 0) return res.rows[0];
      } catch (err) {
        console.warn(`[POSTGRESQL] Find by TMDB ID notice for "${tmdbId}":`, err.message);
      }
    }

    const seedMatch = seedMovies.find(m => m.tmdb_id === parseInt(tmdbId, 10));
    return seedMatch || null;
  }

  /**
   * Save or update movie reference with tmdb_id in PostgreSQL
   */
  async saveMovieReference({ movie_name, tmdb_id, poster_path = '', backdrop_path = '', overview = '', vote_average = 0 }) {
    if (!movie_name || !tmdb_id) return null;
    if (db.isDbConnected()) {
      try {
        const queryText = `
          INSERT INTO movie_references (movie_name, tmdb_id, poster_path, backdrop_path, overview, vote_average)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (movie_name) DO UPDATE 
          SET tmdb_id = EXCLUDED.tmdb_id,
              poster_path = EXCLUDED.poster_path,
              backdrop_path = EXCLUDED.backdrop_path,
              overview = EXCLUDED.overview,
              vote_average = EXCLUDED.vote_average
          RETURNING *;
        `;
        const values = [movie_name.trim(), tmdb_id, poster_path, backdrop_path, overview, vote_average];
        const res = await db.query(queryText, values);
        console.log(`🐘 [POSTGRESQL] Saved movie "${movie_name}" with TMDB_ID=${tmdb_id} to database.`);
        return res.rows[0];
      } catch (err) {
        console.warn(`[POSTGRESQL] Save movie notice for "${movie_name}":`, err.message);
      }
    }
    return { movie_name, tmdb_id, poster_path, backdrop_path, overview, vote_average };
  }

  /**
   * Return all pre-seeded movie references and TMDB IDs
   */
  getAllSeedMovies() {
    return seedMovies;
  }
}

module.exports = new MovieDbService();
