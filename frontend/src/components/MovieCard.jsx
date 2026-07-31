import React from 'react';

/**
 * MovieCard Micro-Component (Current Production / Featured Repository)
 * Rendered within the Current Productions grid.
 * Merges live GitHub repository stats with correlated TMDB movie poster & backdrop.
 * Clicking anywhere on the card or poster redirects to the repository contents on GitHub.
 */
export const MovieCard = ({ production, onSelectRepo }) => {
  if (!production) return null;

  const { name, title, description, stargazers_count, forks_count, language, html_url, bannerUrl, movieMatch } = production;

  const repoTitle = name || title || 'Repository';
  const targetUrl = html_url || `https://github.com`;
  
  // Prefer TMDB movie poster, fallback to custom banner or TMDB seed poster
  const posterUrl = movieMatch?.poster || bannerUrl || 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg';
  const repoDesc = description || (movieMatch?.overview ? movieMatch.overview.substring(0, 110) + '...' : 'No description provided.');
  const stars = stargazers_count !== undefined ? stargazers_count : 0;
  const forks = forks_count !== undefined ? forks_count : 0;
  const lang = language || 'JavaScript';

  const handleCardClick = (e) => {
    e.preventDefault();
    if (onSelectRepo) {
      onSelectRepo(production);
    } else {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="movie-card"
      onClick={handleCardClick}
      style={{
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        position: 'relative'
      }}
      title={`Open ${repoTitle} on GitHub (${targetUrl})`}
    >
      <div className="movie-poster-wrapper" style={{ position: 'relative' }}>
        <img 
          src={posterUrl} 
          alt={repoTitle} 
          className="movie-poster-img"
          onError={(e) => {
            e.target.src = 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg';
          }}
        />
        {movieMatch && (
          <div className="movie-status-badge stable" style={{ fontSize: '10px' }}>
            🎬 TMDB: {movieMatch.title} ({movieMatch.rating ? Number(movieMatch.rating).toFixed(1) : '8.0'} ★)
          </div>
        )}
      </div>

      <div className="movie-card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 className="movie-title" style={{ marginTop: 0, marginBottom: '6px' }}>
          <a 
            href={targetUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => e.stopPropagation()}
            style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: '800' }}
          >
            {repoTitle} ↗
          </a>
        </h3>
        
        <p className="movie-description" style={{ flex: 1, marginBottom: '12px' }}>
          {repoDesc}
        </p>

        <div className="movie-meta-footer" style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="tag-badge">{lang}</span>
          <span className="tag-badge muted">★ {stars}</span>
          <span className="tag-badge muted">⑂ {forks}</span>
          <span 
            className="tag-badge" 
            style={{ 
              marginLeft: 'auto', 
              background: 'var(--accent)', 
              color: 'var(--bg)', 
              fontWeight: '800', 
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: '4px'
            }}
          >
            OPEN REPO ↗
          </span>
        </div>
      </div>
    </div>
  );
};
