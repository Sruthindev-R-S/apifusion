/**
 * @fileoverview Service for generating color themes from images.
 */

// For a real implementation, you would use an HTTP client like axios to fetch the image
// and image processing libraries for color extraction.
// You can install them with: npm install axios sharp color
// const axios = require('axios');
// const sharp = require('sharp');
// const Color = require('color');

/**
 * A service class for generating color themes.
 */
class ThemeService {
  /**
   * @param {object} apiClient - An HTTP client instance for fetching image data.
   * @param {object} cacheService - A caching service instance.
   */
  constructor(apiClient, cacheService) {
    this.apiClient = apiClient;
    this.cacheService = cacheService;
  }

  /**
   * Generates a preset or computed color theme for a movie image/title.
   * @param {string} imageUrl - Poster or Backdrop URL.
   * @param {object} movieDetails - Movie object from TMDB.
   * @returns {Promise<object>} A promise that resolves to a theme object.
   */
  async generateThemeFromMovie(imageUrl, movieDetails = {}) {
    const cacheKey = `theme:${movieDetails.id || movieDetails.title || imageUrl || 'default'}`;
    const oneDayInSeconds = 24 * 60 * 60;

    if (this.cacheService) {
      const cachedTheme = await this.cacheService.get(cacheKey);
      if (cachedTheme) {
        return cachedTheme;
      }
    }

    const title = movieDetails.title || 'Cinematic Theme';
    
    // Preset dynamic palette generator based on movie title hash or genres
    const palettes = [
      {
        name: 'Cyber Neon (Sci-Fi)',
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
      },
      {
        name: 'Crimson Noir (Action/Thriller)',
        colors: {
          '--bg-primary': '#0f0507',
          '--bg-surface': '#1a0a0f',
          '--bg-card': '#2a1219',
          '--accent': '#e11d48',
          '--accent-glow': 'rgba(225, 29, 72, 0.4)',
          '--text-primary': '#fff1f2',
          '--text-secondary': '#fda4af',
          '--border-color': 'rgba(225, 29, 72, 0.25)'
        }
      },
      {
        name: 'Golden Myth (Drama/Adventure)',
        colors: {
          '--bg-primary': '#0f0c03',
          '--bg-surface': '#1c1708',
          '--bg-card': '#2c2510',
          '--accent': '#eab308',
          '--accent-glow': 'rgba(234, 179, 8, 0.4)',
          '--text-primary': '#fefce8',
          '--text-secondary': '#fef08a',
          '--border-color': 'rgba(234, 179, 8, 0.25)'
        }
      },
      {
        name: 'Emerald Matrix (Tech/Mystery)',
        colors: {
          '--bg-primary': '#02120d',
          '--bg-surface': '#062319',
          '--bg-card': '#0c3829',
          '--accent': '#10b981',
          '--accent-glow': 'rgba(16, 185, 129, 0.4)',
          '--text-primary': '#ecfdf5',
          '--text-secondary': '#6ee7b7',
          '--border-color': 'rgba(16, 185, 129, 0.25)'
        }
      },
      {
        name: 'Vivid Violet (Fantasy)',
        colors: {
          '--bg-primary': '#0d0714',
          '--bg-surface': '#170d24',
          '--bg-card': '#25163a',
          '--accent': '#a855f7',
          '--accent-glow': 'rgba(168, 85, 247, 0.4)',
          '--text-primary': '#faf5ff',
          '--text-secondary': '#d8b4fe',
          '--border-color': 'rgba(168, 85, 247, 0.25)'
        }
      }
    ];

    // Pick palette hash based on movie ID or title length
    const hash = (movieDetails.id || title.length) % palettes.length;
    const selected = palettes[hash];

    const theme = {
      id: `theme-${movieDetails.id || 'default'}`,
      title: title,
      posterUrl: imageUrl,
      backdropUrl: movieDetails.backdrop_path ? `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}` : '',
      overview: movieDetails.overview || '',
      vote_average: movieDetails.vote_average || 0,
      release_date: movieDetails.release_date || '',
      themeName: selected.name,
      colors: selected.colors
    };

    if (this.cacheService) {
      await this.cacheService.set(cacheKey, theme, oneDayInSeconds);
    }

    return theme;
  }

  async generateThemeFromImage(imageUrl) {
    return this.generateThemeFromMovie(imageUrl, {});
  }
}

module.exports = ThemeService;