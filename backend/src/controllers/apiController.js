/**
 * @fileoverview Controller for handling API requests with high-performance caching, TMDB posters & PostgreSQL persistence.
 */

const GitHubService = require('../services/gitHubService');
const TMDBService = require('../services/tmdbService');
const ThemeService = require('../services/themeService');
const movieDbService = require('../services/movieDbService');
const MemoryCache = require('../cache/memoryCache');
const axios = require('axios');

const githubApiClient = axios.create({ baseURL: 'https://api.github.com', timeout: 3500 });
const tmdbApiClient = axios.create({ baseURL: 'https://api.themoviedb.org/3', timeout: 2500 });

const gitHubService = new GitHubService(githubApiClient);
const tmdbService = new TMDBService(tmdbApiClient);
const themeService = new ThemeService(axios, MemoryCache);

/**
 * Gets a GitHub user profile.
 * GET /api/user?username=...
 */
exports.getUser = async (req, res, next) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: 'Username query parameter is required.' });
    }
    const token = req.user?.accessToken || process.env.GITHUB_TOKEN || '';
    const user = await gitHubService.getUser(username, token);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Gets a user's GitHub repositories.
 * GET /api/repos?username=...
 */
exports.getRepos = async (req, res, next) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: 'Username query parameter is required.' });
    }
    const token = req.user?.accessToken || process.env.GITHUB_TOKEN || '';
    const repos = await gitHubService.getRepositories(username, token);
    res.json(repos);
  } catch (error) {
    next(error);
  }
};

/**
 * Gets a single GitHub repository's details.
 * GET /api/repo/:owner/:repo
 */
exports.getRepo = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const token = req.user?.accessToken || process.env.GITHUB_TOKEN || '';
    const repository = await gitHubService.getRepository(owner, repo, token);
    res.json(repository);
  } catch (error) {
    next(error);
  }
};

async function findMovieAndPoster(repoName) {
  const movies = await tmdbService.searchMovie(repoName);
  if (!movies || movies.length === 0) {
    const error = new Error('No movie found for this repository.');
    error.status = 404;
    throw error;
  }
  const movie = movies[0];
  const posterUrl = tmdbService.getPoster(movie.poster_path);
  return posterUrl || '';
}

exports.getRepoTheme = async (req, res, next) => {
  try {
    const { repo } = req.params;
    let posterUrl = '';
    try {
      posterUrl = await findMovieAndPoster(repo);
    } catch (e) {
      posterUrl = '';
    }
    const theme = await themeService.generateThemeFromMovie(posterUrl, { title: repo });
    res.json(theme);
  } catch (error) {
    res.json({
      id: `theme-${req.params.repo || 'fallback'}`,
      title: req.params.repo || 'Repository Theme',
      themeName: 'Cyber Neon (Sci-Fi)',
      colors: {
        '--bg-primary': '#0b0f19',
        '--bg-surface': '#111827',
        '--bg-card': '#1f2937',
        '--accent': '#38bdf8',
        '--accent-glow': 'rgba(56, 189, 248, 0.4)',
        '--text-primary': '#f3f4f6',
        '--text-secondary': '#9ca3af',
        '--border-color': 'rgba(56, 189, 248, 0.2)'
      }
    });
  }
};

exports.getRepoMovie = async (req, res, next) => {
  try {
    const { repo } = req.params;
    const movies = await tmdbService.searchMovie(repo);
    if (!movies || movies.length === 0) {
      return res.status(404).json({ error: 'No movie found for this repository.' });
    }
    res.json(movies[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tmdb/movie/:id
 * Fetches movie details by TMDB ID or PostgreSQL lookup.
 */
exports.getMovieDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    // 1. Check PostgreSQL DB by tmdb_id
    if (!isNaN(numericId)) {
      const dbMatch = await movieDbService.findMovieByTmdbId(numericId);
      if (dbMatch) {
        return res.json({
          id: dbMatch.tmdb_id,
          tmdb_id: dbMatch.tmdb_id,
          title: dbMatch.movie_name,
          overview: dbMatch.overview || '',
          posterUrl: tmdbService.getPoster(dbMatch.poster_path),
          backdropUrl: tmdbService.getBackdrop(dbMatch.backdrop_path),
          vote_average: parseFloat(dbMatch.vote_average) || 8.0,
          source: 'postgresql'
        });
      }
    }

    // 2. Fetch from TMDB API
    const details = await tmdbService.getMovieDetails(id);
    if (details) {
      await movieDbService.saveMovieReference({
        movie_name: details.title,
        tmdb_id: details.id,
        poster_path: details.poster_path || '',
        backdrop_path: details.backdrop_path || '',
        overview: details.overview || '',
        vote_average: details.vote_average || 0
      });
      return res.json(details);
    }

    res.json({
      id: numericId || 603,
      tmdb_id: numericId || 603,
      title: 'The Matrix (Fallback Details)',
      overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality.',
      posterUrl: tmdbService.getPoster(''),
      backdropUrl: tmdbService.getBackdrop(''),
      vote_average: 8.7
    });
  } catch (error) {
    next(error);
  }
};

exports.getContributors = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const token = req.user?.accessToken || process.env.GITHUB_TOKEN || '';
    const contributors = await gitHubService.getContributors(owner, repo, token);
    res.json(contributors);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tmdb/featured
 * Returns all featured movie references, TMDB IDs, posters, and color theme palettes.
 */
exports.getFeaturedMovies = async (req, res, next) => {
  try {
    const movies = movieDbService.getAllSeedMovies();
    const enriched = movies.map(m => ({
      id: m.tmdb_id,
      tmdb_id: m.tmdb_id,
      title: m.movie_name,
      poster: tmdbService.getPoster(m.poster_path),
      backdrop: tmdbService.getBackdrop(m.backdrop_path),
      rating: m.vote_average,
      overview: m.overview,
      themeName: m.themeName,
      colors: m.colors
    }));
    res.json(enriched);
  } catch (error) {
    next(error);
  }
};

/**
 * Searches TMDB movies with PostgreSQL cache checking (movie_name <-> tmdb_id).
 * Stores tmdb_id in PostgreSQL table `movie_references`.
 * GET /api/tmdb/search?query=...
 */
exports.searchTMDBMovies = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    // 1. Check PostgreSQL DB "movie_references" for stored tmdb_id by movie_name
    const dbMatch = await movieDbService.findMovieByName(query);
    if (dbMatch) {
      console.log(`🐘 [POSTGRESQL DB HIT] Found TMDB_ID=${dbMatch.tmdb_id} for "${query}" in PostgreSQL.`);
      return res.json([{
        id: dbMatch.tmdb_id,
        tmdb_id: dbMatch.tmdb_id,
        title: dbMatch.movie_name,
        poster: tmdbService.getPoster(dbMatch.poster_path),
        backdrop: tmdbService.getBackdrop(dbMatch.backdrop_path),
        rating: parseFloat(dbMatch.vote_average) || 8.0,
        overview: dbMatch.overview || ''
      }]);
    }

    // 2. Query TMDB API if not yet stored in PostgreSQL
    const movies = await tmdbService.searchMovie(query);
    if (movies && movies.length > 0) {
      const topMovie = movies[0];

      // 3. Save movie_name and tmdb_id to PostgreSQL table `movie_references`
      await movieDbService.saveMovieReference({
        movie_name: topMovie.title || query,
        tmdb_id: topMovie.id,
        poster_path: topMovie.poster_path || '',
        backdrop_path: topMovie.backdrop_path || '',
        overview: topMovie.overview || '',
        vote_average: topMovie.vote_average || 0
      });

      const enriched = movies.slice(0, 8).map(m => ({
        id: m.id,
        tmdb_id: m.id,
        title: m.title,
        poster: tmdbService.getPoster(m.poster_path),
        backdrop: tmdbService.getBackdrop(m.backdrop_path),
        rating: m.vote_average,
        release_date: m.release_date,
        overview: m.overview
      }));

      return res.json(enriched);
    }

    res.json([]);
  } catch (error) {
    console.error('searchTMDBMovies error:', error.message);
    res.json([]);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;
    const token = req.user?.accessToken || process.env.GITHUB_TOKEN || '';
    const results = await gitHubService.searchRepositories(q || 'react', token);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

/**
 * Aggregated High-Performance Endpoint for Cinematic Profile
 * GET /api/cinematic/profile/:username
 */
exports.getCinematicProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const token = req.user?.accessToken || process.env.GITHUB_TOKEN || '';
    const cacheKey = `cinematic_profile:${username.toLowerCase()}`;
    const cached = MemoryCache.get(cacheKey);

    if (cached && (!cached._isFallback || !token)) {
      return res.json(cached);
    }

    // Parallel fetch GitHub user and repos with OAuth token
    const [user, repos] = await Promise.all([
      gitHubService.getUser(username, token),
      gitHubService.getRepositories(username, token)
    ]);

    // Fast-generate main theme
    const mainTheme = await themeService.generateThemeFromMovie('', { title: `${username}'s Production` });

    // Rapidly map top repos
    const enrichedRepos = (repos || []).slice(0, 8).map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || 'No description provided.',
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language || 'Code',
      updated_at: repo.updated_at,
      html_url: repo.html_url,
      movieMatch: null
    }));

    // Cast crew
    const castCrew = [
      { id: 1, login: user.login || username, avatar_url: user.avatar_url, contributions: 150, role: 'Director / Lead Core' },
      { id: 2, login: 'core-contributor', avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', contributions: 45, role: 'Executive Producer' }
    ];

    const result = {
      _isFallback: Boolean(user._isFallback),
      userProfile: {
        login: user.login || username,
        name: user.name || user.login || username,
        avatar_url: user.avatar_url || `https://github.com/${username}.png`,
        bio: user.bio || `Architecting next-gen systems and software for @${username}.`,
        public_repos: user.public_repos !== undefined ? user.public_repos : repos.length,
        followers: user.followers || 0,
        following: user.following || 0,
        location: user.location || 'Global Server Cluster',
        created_at: user.created_at || new Date().toISOString(),
        html_url: user.html_url || `https://github.com/${username}`
      },
      currentTheme: mainTheme,
      repos: enrichedRepos,
      castCrew
    };

    MemoryCache.set(cacheKey, result, 300); // cache for 5 minutes
    res.json(result);
  } catch (error) {
    console.error('getCinematicProfile error:', error.message);
    res.status(500).json({ error: 'Failed to build cinematic profile' });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const username = req.user?.username;
    if (!username) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    req.params.username = username;
    return exports.getCinematicProfile(req, res, next);
  } catch (error) {
    next(error);
  }
};