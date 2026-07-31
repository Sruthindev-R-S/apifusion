import React from 'react';

/**
 * MovieCard Micro-Component (Current Production / Featured Repository)
 * Rendered within the Current Productions grid.
 * Merges live GitHub repository stats with correlated TMDB movie poster & backdrop.
 */
export const MovieCard = ({ production }) => {
  if (!production) return null;

  const { name, title, description, stargazers_count, forks_count, language, html_url, bannerUrl, movieMatch } = production;

  const repoTitle = name || title || 'Repository';
  const posterUrl = movieMatch?.poster || bannerUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
  const repoDesc = description || (movieMatch?.overview ? movieMatch.overview.substring(0, 100) + '...' : 'No description provided.');
  const stars = stargazers_count !== undefined ? stargazers_count : 0;
  const forks = forks_count !== undefined ? forks_count : 0;
  const lang = language || 'JavaScript';

  return (
    <div className="movie-card">
      <div className="movie-poster-wrapper">
        <img 
          src={posterUrl} 
          alt={repoTitle} 
          className="movie-poster-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
          }}
        />
        {movieMatch && (
          <div className="movie-status-badge stable">
            TMDB: {movieMatch.title} ({movieMatch.rating ? movieMatch.rating.toFixed(1) : '8.0'} ★)
          </div>
        )}
      </div>

      <div className="movie-card-body">
        <h3 className="movie-title">
          <a href={html_url || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
            {repoTitle}
          </a>
        </h3>
        <p className="movie-description">{repoDesc}</p>

        <div className="movie-meta-footer">
          <span className="tag-badge">{lang}</span>
          <span className="tag-badge muted">★ {stars}</span>
          <span className="tag-badge muted">⑂ {forks}</span>
        </div>
      </div>
    </div>
  );
};
