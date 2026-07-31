/**
 * @fileoverview Defines all API endpoints for the application.
 */

const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { optionalAuth } = require('../middleware/authMiddleware');

// Mount optional JWT authentication middleware to populate req.user on all API routes
router.use(optionalAuth);

// GET /api/me
router.get('/me', apiController.getMe);

// GET /api/user?username=...
router.get('/user', apiController.getUser);

// GET /api/repos?username=...
router.get('/repos', apiController.getRepos);

// GET /api/repo/theme/:repo
router.get('/repo/theme/:repo', apiController.getRepoTheme);

// GET /api/repo/movie/:repo
router.get('/repo/movie/:repo', apiController.getRepoMovie);

// GET /api/repo/languages/:owner/:repo
router.get('/repo/languages/:owner/:repo', apiController.getRepoLanguages);

// GET /api/repo/contributors/:owner/:repo
router.get('/repo/contributors/:owner/:repo', apiController.getContributors);

// GET /api/repo/tree/:owner/:repo
router.get('/repo/tree/:owner/:repo', apiController.getRepoTree);

// GET /api/repo/contents/:owner/:repo
router.get('/repo/contents/:owner/:repo', apiController.getRepoContents);

// GET /api/repo/file/:owner/:repo
router.get('/repo/file/:owner/:repo', apiController.getFileContent);

// GET /api/repo/:owner/:repo
router.get('/repo/:owner/:repo', apiController.getRepo);

// GET /api/tmdb/search?query=...
router.get('/tmdb/search', apiController.searchTMDBMovies);

// POST /api/tmdb/save
router.post('/tmdb/save', apiController.saveMovieReference);

// GET /api/tmdb/featured
router.get('/tmdb/featured', apiController.getFeaturedMovies);

// GET /api/tmdb/movie/:id
router.get('/tmdb/movie/:id', apiController.getMovieDetails);

// GET /api/cinematic/profile/:username
router.get('/cinematic/profile/:username', apiController.getCinematicProfile);

// GET /api/search?q=...
router.get('/search', apiController.search);

module.exports = router;