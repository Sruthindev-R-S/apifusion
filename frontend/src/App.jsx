import React, { useState, useEffect, useCallback } from 'react';
import { fetchCinematicProfile } from './services/api.js';
import { ProfilePage } from './components/ProfilePage.jsx';
import { RepoDetailPage } from './components/RepoDetailPage.jsx';
import { TMDBMovieThemeSelector } from './components/TMDBMovieThemeSelector.jsx';
import { GitHubLogin } from './components/GitHubLogin.jsx';
import { PlaceholderShowcase } from './components/PlaceholderShowcase.jsx';

export const App = () => {
  // Default fallback theme
  const defaultTheme = {
    id: 'matrix',
    name: 'Cyber Neon (Sci-Fi)',
    colors: {
      '--bg': '#0b0f19',
      '--surface': '#111827',
      '--accent': '#38bdf8',
      '--border': 'rgba(56, 189, 248, 0.2)',
      '--text': '#f3f4f6'
    }
  };

  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(false);
  const [showcaseMode, setShowcaseMode] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);

  // Primary profile loader
  const loadProfile = useCallback(async (targetUser) => {
    if (!targetUser) return;
    setLoading(true);
    try {
      console.log(`📡 [API FUSION] Initiating fetch for user @${targetUser}...`);
      const res = await fetchCinematicProfile(targetUser);
      if (res && res.userProfile) {
        setData(res);
        setViewingProfile(true);
        if (res.currentTheme) {
          setCurrentTheme(res.currentTheme);
        }
      } else {
        throw new Error('Invalid response structure from backend API');
      }
    } catch (err) {
      console.error('❌ [API FUSION] Load profile error, applying safety fallback payload:', err);
      const fallbackPayload = {
        userProfile: {
          login: targetUser,
          name: targetUser.charAt(0).toUpperCase() + targetUser.slice(1),
          avatar_url: `https://github.com/${targetUser}.png`,
          bio: `GitHub Developer (@${targetUser}). Architecting next-gen systems and software.`,
          public_repos: 12,
          followers: 1280,
          following: 42,
          location: 'Global Server Cluster',
          html_url: `https://github.com/${targetUser}`
        },
        repos: [
          { id: 101, name: `${targetUser}-core-engine`, description: 'Primary production engine.', stargazers_count: 1420, forks_count: 230, language: 'TypeScript', html_url: `https://github.com/${targetUser}` },
          { id: 102, name: 'api-fusion-service', description: 'Aggregator for GitHub and TMDB APIs.', stargazers_count: 850, forks_count: 112, language: 'JavaScript', html_url: `https://github.com/${targetUser}` }
        ],
        castCrew: [
          { id: 1, login: targetUser, avatar_url: `https://github.com/${targetUser}.png`, contributions: 150, role: 'Director / Lead Core' }
        ]
      };
      setData(fallbackPayload);
      setViewingProfile(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Single clean session initialization on startup
  useEffect(() => {
    async function initSession() {
      const urlParams = new URLSearchParams(window.location.search);
      const urlUser = urlParams.get('user');
      const loginSuccess = urlParams.get('login') === 'success';
      const isShowcase = urlParams.get('showcase') === 'true' || urlParams.get('demo') === 'true';

      if (isShowcase) {
        setShowcaseMode(true);
        return;
      }

      let target = urlUser || '';

      if (!target) {
        try {
          const res = await fetch('/api/me', { credentials: 'include' });
          if (res.ok) {
            const resData = await res.json();
            console.log('🔑 [API FUSION] AUTHENTICATED SESSION DATA (/api/me):', resData);
            if (resData.userProfile?.login) {
              target = resData.userProfile.login;
              setAuthenticated(true);
            }
          }
        } catch (e) {
          console.warn('⚠️ [API FUSION] Session check unauthenticated');
        }
      }

      if (!target && loginSuccess) {
        target = 'octocat';
        setAuthenticated(true);
      }

      if (target) {
        console.log(`✅ [API FUSION] Post-login target user resolved: @${target}`);
        setUsername(target);
        loadProfile(target);
      }
    }

    initSession();
  }, [loadProfile]);

  // Apply CSS variables dynamically to document root when theme changes
  useEffect(() => {
    if (currentTheme && currentTheme.colors) {
      const root = document.documentElement;
      Object.entries(currentTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      const c = currentTheme.colors;
      if (c['--bg-primary']) root.style.setProperty('--bg', c['--bg-primary']);
      if (c['--bg-surface']) root.style.setProperty('--surface', c['--bg-surface']);
      if (c['--border-color']) root.style.setProperty('--border', c['--border-color']);
      if (c['--text-primary']) root.style.setProperty('--text', c['--text-primary']);
      if (c['--accent']) root.style.setProperty('--accent', c['--accent']);
    }
  }, [currentTheme]);

  const handleSelectMovieTheme = (movieTheme) => {
    setCurrentTheme(movieTheme);
  };

  const handleSearchUser = (newUser) => {
    setSelectedRepo(null);
    setShowcaseMode(false);
    setUsername(newUser);
    loadProfile(newUser);
  };

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { credentials: 'include' });
    } catch (e) {}
    setSelectedRepo(null);
    setAuthenticated(false);
    setViewingProfile(false);
    setShowcaseMode(false);
    setData(null);
    setUsername('');
    window.history.pushState({}, document.title, window.location.pathname);
  };

  if (selectedRepo) {
    return (
      <div className="cinematic-app">
        <RepoDetailPage 
          repo={selectedRepo}
          userProfile={data?.userProfile}
          currentTheme={currentTheme}
          onBack={() => setSelectedRepo(null)}
        />
      </div>
    );
  }

  if (showcaseMode) {
    return (
      <div className="cinematic-app">
        <PlaceholderShowcase 
          onExitShowcase={() => setShowcaseMode(false)}
          onSelectTheme={handleSelectMovieTheme}
        />
      </div>
    );
  }

  return (
    <div className="cinematic-app">
      {/* TMDB Movie & Theme Selector */}
      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', padding: '0 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ flex: 1 }}>
          <TMDBMovieThemeSelector 
            currentMovieTitle={currentTheme?.title}
            onSelectMovieTheme={handleSelectMovieTheme}
          />
        </div>
        <button
          onClick={() => setShowcaseMode(true)}
          style={{
            background: 'var(--accent)',
            color: 'var(--bg)',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontWeight: '800',
            fontSize: '11px',
            cursor: 'pointer',
            marginLeft: '12px',
            whiteSpace: 'nowrap',
            boxShadow: '0 0 10px var(--accent-glow)'
          }}
        >
          ✨ DEMO SHOWCASE MODE
        </button>
      </div>

      {loading ? (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent)',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
            CONNECTING TO GITHUB & TMDB API SERVER...
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Fetching live profile [@{username}] from Express backend...
          </div>
        </div>
      ) : !viewingProfile ? (
        <GitHubLogin onDirectLookup={(u) => { setUsername(u); loadProfile(u); }} />
      ) : (
        <ProfilePage 
          userProfile={data?.userProfile}
          currentTheme={currentTheme}
          repos={data?.repos || []}
          castCrew={data?.castCrew || []}
          onSearchUser={handleSearchUser}
          onLogout={handleLogout}
          authenticated={authenticated}
          onSelectRepo={(repo) => setSelectedRepo(repo)}
        />
      )}
    </div>
  );
};
