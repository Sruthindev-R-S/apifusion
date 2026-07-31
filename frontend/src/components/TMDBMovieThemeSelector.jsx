import React, { useState, useEffect } from 'react';

/**
 * TMDB Movie Reference & Theme Selector Micro-Component
 * Allows searching ANY movie from TMDB database or picking featured movie references.
 * Dynamically updates document root CSS variables and backdrop banner.
 */
export const TMDBMovieThemeSelector = ({ onSelectMovieTheme, currentMovieTitle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [featuredList, setFeaturedList] = useState([]);

  // Fetch featured movie references and color themes from backend API
  useEffect(() => {
    async function loadFeaturedMovies() {
      try {
        const res = await fetch('/api/tmdb/featured');
        if (res.ok) {
          const movies = await res.json();
          if (movies && movies.length > 0) {
            setFeaturedList(movies);
          }
        }
      } catch (e) {
        console.warn('Featured movies fetch notice:', e);
      }
    }
    loadFeaturedMovies();
  }, []);

  const handleSearchTMDB = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setShowDropdown(true);
    try {
      const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const movies = await res.json();
        setSearchResults(movies);
      }
    } catch (err) {
      console.error('TMDB Movie Search Error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectMovie = (movie) => {
    const palettes = [
      { name: 'Cyber Blue', accent: '#38bdf8', bg: '#0b0f19', surface: '#111827', card: '#1f2937' },
      { name: 'Crimson Red', accent: '#f43f5e', bg: '#110609', surface: '#1f0a10', card: '#33121b' },
      { name: 'Amber Gold', accent: '#f59e0b', bg: '#120d04', surface: '#211808', card: '#33250c' },
      { name: 'Emerald Green', accent: '#10b981', bg: '#02120d', surface: '#062319', card: '#0c3829' },
      { name: 'Purple Void', accent: '#a855f7', bg: '#0e0716', surface: '#1a0d28', card: '#29153d' }
    ];

    const hash = ((movie.id || movie.tmdb_id || 1) + (movie.title ? movie.title.length : 0)) % palettes.length;
    const p = palettes[hash];

    const customTheme = {
      id: `tmdb-${movie.id || movie.tmdb_id || Date.now()}`,
      title: movie.title,
      themeName: movie.themeName || `TMDB: ${movie.title}`,
      posterUrl: movie.poster || movie.posterUrl || '',
      backdropUrl: movie.backdrop || movie.backdropUrl || '',
      overview: movie.overview || '',
      vote_average: movie.rating || movie.vote_average || 8.0,
      colors: movie.colors || {
        '--bg-primary': p.bg,
        '--bg-surface': p.surface,
        '--bg-card': p.card,
        '--accent': p.accent,
        '--accent-glow': `rgba(56, 189, 248, 0.4)`,
        '--text-primary': '#f8fafc',
        '--text-secondary': '#94a3b8',
        '--border-color': 'rgba(255, 255, 255, 0.15)'
      }
    };

    if (onSelectMovieTheme) {
      onSelectMovieTheme(customTheme);
    }
    setShowDropdown(false);
  };

  return (
    <div className="tmdb-theme-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', width: '100%' }}>
        <div className="bar-label">
          <span>🎬 TMDB MOVIE THEME ENGINE:</span>
        </div>

        {/* Live TMDB Movie Search Form */}
        <div style={{ position: 'relative', flex: '1', maxWidth: '380px' }}>
          <form onSubmit={handleSearchTMDB} style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              placeholder="Search ANY TMDB Movie (e.g. Matrix, Dune, Spider-Man)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
              style={{
                flex: 1,
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '5px 10px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--accent)',
                color: 'var(--bg)',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontWeight: '700',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              {searching ? 'SEARCHING...' : 'SEARCH MOVIE'}
            </button>
          </form>

          {/* TMDB Live Search Results Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.7)',
              zIndex: 1000,
              maxHeight: '280px',
              overflowY: 'auto'
            }}>
              {searchResults.map((m) => (
                <div
                  key={m.id || m.tmdb_id}
                  onClick={() => handleSelectMovie(m)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {m.poster ? (
                    <img src={m.poster} alt={m.title} style={{ width: '28px', height: '40px', borderRadius: '3px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '28px', height: '40px', background: 'var(--bg)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>🎬</div>
                  )}
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ color: 'var(--text)', fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.title} {m.tmdb_id ? `[TMDB #${m.tmdb_id}]` : ''}
                    </div>
                    <div style={{ color: 'var(--accent)', fontSize: '10px' }}>
                      {m.rating ? `${m.rating.toFixed(1)} ★` : 'TMDB Match'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured Preset Movie Chips with TMDB IDs */}
        <div className="palette-chips">
          {featuredList.map((m) => (
            <button
              key={m.tmdb_id || m.id}
              className={`palette-btn ${currentMovieTitle === m.title ? 'active' : ''}`}
              onClick={() => handleSelectMovie(m)}
              title={`Apply ${m.title} (TMDB #${m.tmdb_id}) theme`}
            >
              <span 
                className="palette-swatch" 
                style={{ backgroundColor: m.colors ? m.colors['--accent'] : 'var(--accent)' }}
              />
              {m.title} [#{m.tmdb_id}]
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
