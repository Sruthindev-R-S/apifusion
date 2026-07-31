import React, { useState, useEffect, useRef } from 'react';

/**
 * TMDB Movie Reference & Theme Selector Micro-Component
 * Features:
 *  • Live debounced TMDB as-you-type search + form submit search
 *  • Active searching feedback & explicit "No movies found" notification card
 *  • Immediate UI frame theme application (colors, backdrop, poster)
 *  • Automatic persistence to PostgreSQL `movie_references` database via POST /api/tmdb/save
 */
export const TMDBMovieThemeSelector = ({ onSelectMovieTheme, currentMovieTitle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [featuredList, setFeaturedList] = useState([]);
  
  const searchContainerRef = useRef(null);

  // Load pre-seeded/saved movies from database
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

  // Click-outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live debounced search effect as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      setHasSearched(true);
      setShowDropdown(true);

      // Local fallback matches from featured list
      const localMatches = featuredList.filter(m => 
        (m.title || m.movie_name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );

      try {
        const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const remoteMovies = await res.json();
          if (Array.isArray(remoteMovies) && remoteMovies.length > 0) {
            setSearchResults(remoteMovies);
          } else if (localMatches.length > 0) {
            setSearchResults(localMatches);
          } else {
            setSearchResults([]);
          }
        } else if (localMatches.length > 0) {
          setSearchResults(localMatches);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.warn('TMDB live search notice:', err);
        setSearchResults(localMatches);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, featuredList]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setHasSearched(true);
    setShowDropdown(true);

    try {
      const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const movies = await res.json();
        setSearchResults(movies || []);
      }
    } catch (err) {
      console.error('TMDB Search Error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectMovie = async (movie) => {
    const palettes = [
      { name: 'Cyber Blue', accent: '#38bdf8', bg: '#0b0f19', surface: '#111827', card: '#1f2937' },
      { name: 'Crimson Red', accent: '#f43f5e', bg: '#110609', surface: '#1f0a10', card: '#33121b' },
      { name: 'Amber Gold', accent: '#f59e0b', bg: '#120d04', surface: '#211808', card: '#33250c' },
      { name: 'Emerald Green', accent: '#10b981', bg: '#02120d', surface: '#062319', card: '#0c3829' },
      { name: 'Purple Void', accent: '#a855f7', bg: '#0e0716', surface: '#1a0d28', card: '#29153d' }
    ];

    const movieTitle = movie.title || movie.movie_name || 'Movie Theme';
    const hash = ((movie.id || movie.tmdb_id || 1) + movieTitle.length) % palettes.length;
    const p = movie.colors ? null : palettes[hash];

    const customTheme = {
      id: `tmdb-${movie.id || movie.tmdb_id || Date.now()}`,
      title: movieTitle,
      themeName: movie.themeName || `TMDB: ${movieTitle}`,
      posterUrl: movie.poster || movie.posterUrl || movie.poster_path || '',
      backdropUrl: movie.backdrop || movie.backdropUrl || movie.backdrop_path || '',
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

    // 1. Apply theme to UI Frame immediately
    if (onSelectMovieTheme) {
      onSelectMovieTheme(customTheme);
    }
    setShowDropdown(false);

    // 2. Save movie reference to PostgreSQL DB via backend POST /api/tmdb/save
    try {
      const res = await fetch('/api/tmdb/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: movieTitle,
          tmdb_id: movie.id || movie.tmdb_id,
          poster: customTheme.posterUrl,
          backdrop: customTheme.backdropUrl,
          overview: customTheme.overview,
          rating: customTheme.vote_average
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.movie) {
          setFeaturedList(prev => {
            if (prev.some(m => (m.tmdb_id || m.id) === (data.movie.tmdb_id || data.movie.id))) return prev;
            return [data.movie, ...prev];
          });
        }
      }
    } catch (e) {
      console.warn('Movie DB save notice:', e);
    }
  };

  return (
    <div className="tmdb-theme-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', width: '100%' }}>
        <div className="bar-label">
          <span>🎬 TMDB MOVIE THEME ENGINE:</span>
        </div>

        {/* Live TMDB Movie Search Form & Dropdown */}
        <div ref={searchContainerRef} style={{ position: 'relative', flex: '1', maxWidth: '380px' }}>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              placeholder="Search ANY TMDB Movie (e.g. Matrix, Dune, Spider-Man)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => (searchResults.length > 0 || hasSearched) && setShowDropdown(true)}
              style={{
                flex: 1,
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '6px 12px',
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
                padding: '6px 12px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontWeight: '700',
                fontSize: '11px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {searching ? 'SEARCHING...' : 'SEARCH MOVIE'}
            </button>
          </form>

          {/* TMDB Dropdown Panel: Results, Searching, or No Results Notification */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
              zIndex: 1000,
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {/* Active Searching Status */}
              {searching && (
                <div style={{ padding: '12px', textAlign: 'center', fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                  ⚡ Searching TMDB database for "{searchQuery}"...
                </div>
              )}

              {/* Found Results */}
              {!searching && searchResults.length > 0 && searchResults.map((m) => (
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
                  {m.poster || m.poster_path ? (
                    <img src={m.poster || m.poster_path} alt={m.title || m.movie_name} style={{ width: '28px', height: '40px', borderRadius: '3px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '28px', height: '40px', background: 'var(--bg)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>🎬</div>
                  )}
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ color: 'var(--text)', fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.title || m.movie_name} {(m.id || m.tmdb_id) ? `[TMDB #${m.id || m.tmdb_id}]` : ''}
                    </div>
                    <div style={{ color: 'var(--accent)', fontSize: '10px' }}>
                      {(m.rating || m.vote_average) ? `${Number(m.rating || m.vote_average).toFixed(1)} ★` : 'TMDB Match'}
                    </div>
                  </div>
                </div>
              ))}

              {/* No Movie Found Notification */}
              {!searching && hasSearched && searchResults.length === 0 && (
                <div style={{ padding: '14px 12px', textAlign: 'center', fontSize: '11px', color: '#f43f5e', fontFamily: 'var(--font-mono)', lineHeight: '1.5' }}>
                  ⚠️ No movies found matching "<b>{searchQuery}</b>" on TMDB.
                  <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '4px' }}>
                    Try another title (e.g. Matrix, Dune, Avatar, Spider-Man).
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Featured Movie Preset Chips */}
        <div className="palette-chips">
          {featuredList.map((m) => (
            <button
              key={m.tmdb_id || m.id}
              className={`palette-btn ${currentMovieTitle === (m.title || m.movie_name) ? 'active' : ''}`}
              onClick={() => handleSelectMovie(m)}
              title={`Apply ${m.title || m.movie_name} theme`}
            >
              <span 
                className="palette-swatch" 
                style={{ backgroundColor: m.colors ? m.colors['--accent'] : 'var(--accent)' }}
              />
              {m.title || m.movie_name} [#{m.tmdb_id || m.id}]
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

