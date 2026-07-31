/**
 * @fileoverview Service for interacting with The Movie Database (TMDB) API.
 */

const axios = require('axios');

class TMDBService {
  constructor(apiClient) {
    const headers = { 
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    if (process.env.API_READ_ACCESS_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.API_READ_ACCESS_TOKEN}`;
    }

    const params = {};
    if (process.env.TMDB_API_KEY) {
      params['api_key'] = process.env.TMDB_API_KEY;
    }

    this.apiClient = apiClient || axios.create({
      baseURL: 'https://api.themoviedb.org/3',
      timeout: 3000,
      headers,
      params
    });
  }

  /**
   * Searches for movies based on a query string.
   * @param {string} query 
   */
  async searchMovie(query) {
    try {
      console.log(`🎬 [TMDB API] Searching for movie: "${query}"...`);
      const cleanedQuery = query.replace(/[-_]/g, ' ').replace(/\b(repo|app|js|ts|api|cli|web|v\d+)\b/gi, '').trim() || query;
      
      const { data } = await this.apiClient.get('/search/movie', { 
        params: { query: cleanedQuery },
        timeout: 2500
      });

      if (data && data.results && data.results.length > 0) {
        return data.results.map(movie => ({
          id: movie.id,
          tmdb_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          posterUrl: this.getPoster(movie.poster_path),
          backdropUrl: this.getBackdrop(movie.backdrop_path),
          overview: movie.overview,
          vote_average: movie.vote_average,
          release_date: movie.release_date
        }));
      }
      return [];
    } catch (error) {
      console.warn(`🎬 [TMDB API] Search notice for "${query}": ${error.message}`);
      return [];
    }
  }

  /**
   * Fetches detailed information for a movie by TMDB ID.
   * @param {number} movieId 
   */
  async getMovieDetails(movieId) {
    try {
      const { data } = await this.apiClient.get(`/movie/${movieId}`);
      if (data) {
        return {
          id: data.id,
          tmdb_id: data.id,
          title: data.title,
          tagline: data.tagline || '',
          overview: data.overview || '',
          poster_path: data.poster_path,
          backdrop_path: data.backdrop_path,
          posterUrl: this.getPoster(data.poster_path),
          backdropUrl: this.getBackdrop(data.backdrop_path),
          vote_average: data.vote_average,
          vote_count: data.vote_count,
          release_date: data.release_date,
          runtime: data.runtime,
          genres: data.genres ? data.genres.map(g => g.name) : [],
          homepage: data.homepage || ''
        };
      }
      return null;
    } catch (error) {
      console.error(`🎬 [TMDB API] getMovieDetails error for ${movieId}:`, error.message);
      return null;
    }
  }

  /**
   * Constructs full URL for a movie poster image.
   * @param {string} posterPath 
   */
  getPoster(posterPath) {
    if (!posterPath) {
      return 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80';
    }
    return posterPath.startsWith('http') ? posterPath : `https://image.tmdb.org/t/p/w500${posterPath}`;
  }

  /**
   * Constructs full URL for a movie backdrop image.
   * @param {string} backdropPath 
   */
  getBackdrop(backdropPath) {
    if (!backdropPath) {
      return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80';
    }
    return backdropPath.startsWith('http') ? backdropPath : `https://image.tmdb.org/t/p/original${backdropPath}`;
  }
}

module.exports = TMDBService;