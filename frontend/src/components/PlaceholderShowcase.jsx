import React, { useState } from 'react';
import { ProfileHeader } from './ProfileHeader.jsx';
import { StatBox } from './StatBox.jsx';
import { MovieCard } from './MovieCard.jsx';
import { TimelineNode } from './TimelineNode.jsx';
import { CollaboratorChip } from './CollaboratorChip.jsx';

/**
 * Dedicated Showcase / Demo Profile Component
 * Designed for instant presentation with zero API latency or rate limit dependencies.
 */
export const PlaceholderShowcase = ({ onExitShowcase, onSelectTheme }) => {
  const [activeMovieId, setActiveMovieId] = useState('dune');

  // Featured Demo Themes
  const demoThemes = [
    {
      id: 'dune',
      title: 'Dune: Part Two (2024)',
      vote_average: 8.6,
      overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
      backdropUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80',
      colors: {
        '--bg-primary': '#120e08',
        '--bg-surface': '#211910',
        '--bg-card': '#332719',
        '--accent': '#ffaa00',
        '--accent-glow': 'rgba(255, 170, 0, 0.4)',
        '--text-primary': '#fff3d6',
        '--text-secondary': '#ffdd80',
        '--border-color': 'rgba(255, 170, 0, 0.25)'
      }
    },
    {
      id: 'matrix',
      title: 'The Matrix (1999)',
      vote_average: 8.7,
      overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
      backdropUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      colors: {
        '--bg-primary': '#040d07',
        '--bg-surface': '#0a1a10',
        '--bg-card': '#102b1a',
        '--accent': '#00ff66',
        '--accent-glow': 'rgba(0, 255, 102, 0.4)',
        '--text-primary': '#d0ffd8',
        '--text-secondary': '#88ffaa',
        '--border-color': 'rgba(0, 255, 102, 0.25)'
      }
    },
    {
      id: 'bladerunner',
      title: 'Blade Runner 2049 (2017)',
      vote_average: 8.3,
      overview: 'Young Blade Runner K discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.',
      backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      colors: {
        '--bg-primary': '#0d0714',
        '--bg-surface': '#1a1024',
        '--bg-card': '#281738',
        '--accent': '#ff0055',
        '--accent-glow': 'rgba(255, 0, 85, 0.4)',
        '--text-primary': '#fbe6ff',
        '--text-secondary': '#ff99c8',
        '--border-color': 'rgba(255, 0, 85, 0.25)'
      }
    },
    {
      id: 'interstellar',
      title: 'Interstellar (2014)',
      vote_average: 8.7,
      overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.',
      backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
      colors: {
        '--bg-primary': '#080d1a',
        '--bg-surface': '#10182b',
        '--bg-card': '#192642',
        '--accent': '#38bdf8',
        '--accent-glow': 'rgba(56, 189, 248, 0.4)',
        '--text-primary': '#f0f9ff',
        '--text-secondary': '#93c5fd',
        '--border-color': 'rgba(56, 189, 248, 0.25)'
      }
    }
  ];

  const currentDemo = demoThemes.find(t => t.id === activeMovieId) || demoThemes[0];

  const handleSelectDemoTheme = (theme) => {
    setActiveMovieId(theme.id);
    if (onSelectTheme) onSelectTheme(theme);
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.style.setProperty('--bg', theme.colors['--bg-primary']);
    root.style.setProperty('--surface', theme.colors['--bg-surface']);
    root.style.setProperty('--border', theme.colors['--border-color']);
    root.style.setProperty('--text', theme.colors['--text-primary']);
    root.style.setProperty('--accent', theme.colors['--accent']);
  };

  const showcaseProfile = {
    login: 'Sruthindev-R-S',
    name: 'Sruthindev R S',
    avatar_url: 'https://github.com/Sruthindev-R-S.png',
    bio: 'Full Stack Systems Architect & AI Developer. Building API Fusion, real-time telemetry engines, and cinematic developer interfaces.',
    location: 'Kerala, India // Global Cluster',
    public_repos: 14,
    followers: 1420,
    following: 48,
    html_url: 'https://github.com/Sruthindev-R-S'
  };

  const showcaseStats = [
    { label: 'PUBLIC_REPOSITORIES', value: '14 REPOS' },
    { label: 'TOTAL_STARS', value: '1,420 ★' },
    { label: 'TOTAL_FORKS', value: '230 ⑂' },
    { label: 'NETWORK_FOLLOWERS', value: '1,280 👥' }
  ];

  const showcaseRepos = [
    {
      id: 1,
      name: 'api-fusion-full-stack',
      description: 'Redesigned GitHub interface powered by live REST APIs, TMDB movie correlation, and dynamic CSS palette extraction.',
      stargazers_count: 840,
      forks_count: 142,
      language: 'TypeScript / React',
      html_url: 'https://github.com/Sruthindev-R-S',
      bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      name: 'neural-theme-generator',
      description: 'Automated color palette extraction engine deriving HSL tokens from TMDB backdrop images.',
      stargazers_count: 320,
      forks_count: 48,
      language: 'Python / Fast-API',
      html_url: 'https://github.com/Sruthindev-R-S',
      bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      name: 'postgresql-telemetry-cache',
      description: 'High-throughput PostgreSQL movie_references database service with automatic table seeder.',
      stargazers_count: 210,
      forks_count: 24,
      language: 'Node.js / PostgreSQL',
      html_url: 'https://github.com/Sruthindev-R-S',
      bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      name: 'cinematic-design-system',
      description: 'Modern glassmorphism UI framework built with Vanilla CSS variables and micro-animations.',
      stargazers_count: 190,
      forks_count: 16,
      language: 'CSS3 / JavaScript',
      html_url: 'https://github.com/Sruthindev-R-S',
      bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const showcaseLogs = [
    { id: 'l1', timestamp: '2026-07-31T18:30:00Z', title: 'POSTGRESQL_DB_SEEDED', message: 'Seeded 10 featured movies and TMDB IDs into PostgreSQL apifusion database.' },
    { id: 'l2', timestamp: '2026-07-31T17:45:00Z', title: 'TMDB_THEME_ENGINE_ONLINE', message: 'Loaded dynamic backdrop banners and color palettes for Dune, Matrix, and Blade Runner.' },
    { id: 'l3', timestamp: '2026-07-31T16:15:00Z', title: 'GITHUB_OAUTH_ACTIVE', message: 'Configured GitHub Strategy with 5,000 req/hr rate limit upgrade.' }
  ];

  const showcaseCast = [
    { id: 101, login: 'Sruthindev-R-S', avatar_url: 'https://github.com/Sruthindev-R-S.png', contributions: 240, role: 'Lead Architect & Director' },
    { id: 102, login: 'octocat', avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4', contributions: 85, role: 'GitHub Core QA' },
    { id: 103, login: 'tmdb-integrator', avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', contributions: 42, role: 'Movie Theme Curator' }
  ];

  return (
    <div className="profile-page-wrapper">
      {/* Top Banner Controls */}
      <nav className="top-nav" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="container nav-inner" style={{ padding: '12px 24px' }}>
          <div className="brand-logo">
            <span className="brand-title">API_FUSION // SHOWCASE_PROFILE</span>
            <span className="version-tag" style={{ background: 'var(--accent)', color: 'var(--bg)', fontWeight: '800' }}>
              PRESET_DEMO
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              THEME PRESETS:
            </span>
            {demoThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelectDemoTheme(t)}
                style={{
                  background: activeMovieId === t.id ? 'var(--accent)' : 'var(--bg)',
                  color: activeMovieId === t.id ? 'var(--bg)' : 'var(--text)',
                  border: '1px solid var(--border)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {t.title.split(' ')[0]}
              </button>
            ))}

            {onExitShowcase && (
              <button
                onClick={onExitShowcase}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--accent)',
                  color: 'var(--accent)',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginLeft: '8px'
                }}
              >
                LIVE SEARCH MODE ↗
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Featured Backdrop */}
      <div className="container" style={{ marginTop: '20px' }}>
        <div style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          height: '240px',
          border: '1px solid var(--border)',
          backgroundImage: `linear-gradient(to right, rgba(13,17,23,0.95) 30%, rgba(13,17,23,0.4) 100%), url(${currentDemo.backdropUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          padding: '32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <div>
            <div style={{
              color: 'var(--accent)',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.12em',
              marginBottom: '6px',
              textTransform: 'uppercase'
            }}>
              🎬 FEATURED SHOWCASE MOVIE THEME
            </div>
            <h2 style={{ fontSize: '30px', color: 'var(--text)', marginBottom: '8px', fontWeight: '800' }}>
              {currentDemo.title} ({currentDemo.vote_average} ★)
            </h2>
            <p style={{
              maxWidth: '700px',
              color: 'var(--text-muted)',
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
              {currentDemo.overview}
            </p>
          </div>
        </div>
      </div>

      {/* Main Profile */}
      <main className="container">
        <ProfileHeader profile={showcaseProfile} />

        <section className="stats-grid">
          {showcaseStats.map((stat, idx) => (
            <StatBox key={idx} label={stat.label} value={stat.value} />
          ))}
        </section>

        <div className="main-content-grid">
          <section className="productions-section">
            <div className="section-header">
              <div className="section-title">
                <span className="section-icon"></span>
                <span>FEATURED_REPOSITORIES ({showcaseRepos.length})</span>
              </div>
              <div className="section-controls">FEATURED_SHOWCASE</div>
            </div>

            <div className="productions-grid">
              {showcaseRepos.map((repo) => (
                <MovieCard key={repo.id} production={repo} />
              ))}
            </div>
          </section>

          <section className="log-section">
            <div className="section-header">
              <div className="section-title">
                <span className="section-icon"></span>
                <span>TELEMETRY_PIPELINE_LOG</span>
              </div>
            </div>

            <div className="timeline-container">
              <div className="timeline-list">
                {showcaseLogs.map((log) => (
                  <TimelineNode key={log.id} log={log} />
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="cast-section">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon"></span>
              <span>CONTRIBUTOR_CAST_&_CREW</span>
            </div>
          </div>

          <div className="cast-grid">
            {showcaseCast.map((member) => (
              <CollaboratorChip key={member.id} collaborator={member} />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer-nav">
        <div className="container footer-inner">
          <div className="footer-status">
            © 2026 API_FUSION. SHOWCASE_MODE: ONLINE // GITHUB REST API + TMDB API + POSTGRESQL DB
          </div>
        </div>
      </footer>
    </div>
  );
};
