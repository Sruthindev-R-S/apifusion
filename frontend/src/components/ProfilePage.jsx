import React, { useState } from 'react';
import { ProfileHeader } from './ProfileHeader.jsx';
import { StatBox } from './StatBox.jsx';
import { MovieCard } from './MovieCard.jsx';
import { TimelineNode } from './TimelineNode.jsx';
import { CollaboratorChip } from './CollaboratorChip.jsx';

/**
 * Standalone Profile Page Component
 * Renders GitHub profile data, correlated TMDB movie backdrop & details,
 * repositories grid, and contributor cast.
 */
export const ProfilePage = ({ 
  userProfile, 
  currentTheme,
  repos = [], 
  castCrew = [],
  onSearchUser,
  onLogout,
  authenticated,
  onSelectRepo
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const target = searchInput.trim() || 'octocat';
    if (onSearchUser) {
      onSearchUser(target);
    }
  };

  // Calculate total stars
  const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);

  const telemetryStats = [
    { label: 'PUBLIC_REPOS', value: `${userProfile?.public_repos || repos.length || 0}` },
    { label: 'TOTAL_STARS', value: `${totalStars} ★` },
    { label: 'TOTAL_FORKS', value: `${totalForks} ⑂` },
    { label: 'NETWORK_FOLLOWERS', value: `${userProfile?.followers || 0}` }
  ];

  // Default timeline logs
  const productionLogs = [
    { id: 'log-1', timestamp: '2026-07-31T17:00:00Z', title: 'TMDB_PALETTE_INJECTION', message: `Theme extracted from TMDB movie: "${currentTheme?.title || 'Cinematic Theme'}".` },
    { id: 'log-2', timestamp: '2026-07-31T16:30:00Z', title: 'GITHUB_PIPELINE_SYNC', message: `Fetched ${repos.length} live repositories from GitHub server.` },
    { id: 'log-3', timestamp: '2026-07-31T15:45:00Z', title: 'NEURAL_BUILD_SUCCESS', message: 'Vite build target compiled with 0 critical errors.' }
  ];

  return (
    <div className="profile-page-wrapper">
      {/* Navigation Header with Search */}
      <nav className="top-nav">
        <div className="container nav-inner">
          <div className="brand-logo">
            <span className="brand-title">API_FUSION // GITHUB_CINEMATIC</span>
            <span className="version-tag">v2.0-LIVE</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Search GitHub Username..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
              <button 
                type="submit" 
                style={{
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '700',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                INSPECT
              </button>
            </form>

            {onLogout && (
              <button
                onClick={onLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                LOGOUT
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* TMDB Movie Feature Backdrop Banner if present */}
      {currentTheme && currentTheme.backdropUrl && (
        <div className="container" style={{ marginTop: '20px' }}>
          <div style={{
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            height: '240px',
            border: '1px solid var(--border)',
            backgroundImage: `linear-gradient(to right, rgba(13,17,23,0.95) 30%, rgba(13,17,23,0.4) 100%), url(${currentTheme.backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            padding: '24px'
          }}>
            <div>
              <div style={{
                color: 'var(--accent)',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.1em',
                marginBottom: '6px'
              }}>
                FEATURED TMDB MOVIE CORRELATION
              </div>
              <h2 style={{ fontSize: '28px', color: 'var(--text)', marginBottom: '8px', fontWeight: '800' }}>
                {currentTheme.title} {currentTheme.vote_average ? `(${currentTheme.vote_average.toFixed(1)} ★)` : ''}
              </h2>
              {currentTheme.overview && (
                <p style={{
                  maxWidth: '650px',
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}>
                  {currentTheme.overview}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Profile Container */}
      <main className="container">
        {/* Profile Hero Section */}
        <ProfileHeader profile={userProfile} />

        {/* Telemetry Stats Grid */}
        <section className="stats-grid">
          {telemetryStats.map((stat, idx) => (
            <StatBox key={idx} label={stat.label} value={stat.value} />
          ))}
        </section>

        {/* Middle Main Content Split Grid */}
        <div className="main-content-grid">
          {/* Left Column: Current Repositories (Movie Cards) */}
          <section className="productions-section">
            <div className="section-header">
              <div className="section-title">
                <span className="section-icon"></span>
                <span>GITHUB_REPOSITORIES ({repos.length})</span>
              </div>
              <div className="section-controls">SORT: STARS_RECENT</div>
            </div>

            <div className="productions-grid">
              {repos.map((repo) => (
                <MovieCard key={repo.id} production={repo} onSelectRepo={onSelectRepo} />
              ))}
              {repos.length === 0 && (
                <div style={{ padding: '24px', color: 'var(--text-muted)' }}>
                  No repositories found for this user.
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Production Log */}
          <section className="log-section">
            <div className="section-header">
              <div className="section-title">
                <span className="section-icon"></span>
                <span>SYSTEM_PIPELINE_LOG</span>
              </div>
            </div>

            <div className="timeline-container">
              <div className="timeline-list">
                {productionLogs.map((log) => (
                  <TimelineNode key={log.id} log={log} />
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Cast & Crew Section (Contributors) */}
        {castCrew && castCrew.length > 0 && (
          <section className="cast-section">
            <div className="section-header">
              <div className="section-title">
                <span className="section-icon"></span>
                <span>CAST_&_CREW (REPOSITORIES_CONTRIBUTORS)</span>
              </div>
            </div>

            <div className="cast-grid">
              {castCrew.map((member) => (
                <CollaboratorChip key={member.id} collaborator={member} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer-nav">
        <div className="container footer-inner">
          <div className="footer-status">
            © 2026 API_FUSION. SYSTEM_STATUS: ONLINE // FRONTEND + BACKEND + GITHUB API + TMDB API
          </div>
        </div>
      </footer>
    </div>
  );
};
