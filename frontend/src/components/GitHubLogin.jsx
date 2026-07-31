import React, { useState } from 'react';

/**
 * GitHub Login Landing Component
 * Displays GitHub OAuth Login prompt and quick username lookup options.
 */
export const GitHubLogin = ({ onDirectLookup }) => {
  const [usernameInput, setUsernameInput] = useState('');

  const handleDirectSubmit = (e) => {
    e.preventDefault();
    if (usernameInput.trim() && onDirectLookup) {
      onDirectLookup(usernameInput.trim());
    }
  };

  return (
    <div style={{
      minHeight: '88vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.08) 0%, transparent 70%)'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '36px 32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        textAlign: 'center'
      }}>
        {/* GitHub Icon Badge */}
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 20px auto',
          background: 'var(--bg)',
          borderRadius: '50%',
          border: '1px solid var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px var(--accent-glow)'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent)">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '20px',
          color: 'var(--text)',
          marginBottom: '8px',
          letterSpacing: '0.05em'
        }}>
          API_FUSION // GITHUB LOGIN
        </h1>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '13px',
          lineHeight: '1.5',
          marginBottom: '28px'
        }}>
          Authenticate with your GitHub account to access live developer telemetry, public repositories, and custom TMDB color palettes.
        </p>

        {/* OAuth Native Anchor Button */}
        <a
          href="/auth/github"
          style={{
            display: 'block',
            width: '100%',
            background: 'var(--accent)',
            color: 'var(--bg)',
            textDecoration: 'none',
            padding: '14px 20px',
            borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            fontWeight: '800',
            letterSpacing: '0.05em',
            boxShadow: '0 4px 15px var(--accent-glow)',
            marginBottom: '24px',
            boxSizing: 'border-box'
          }}
        >
          🔑 SIGN IN WITH GITHUB OAUTH
        </a>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '20px 0',
          color: 'var(--text-muted)',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span style={{ padding: '0 12px' }}>OR QUICK USER LOOKUP</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        {/* Quick Direct Username Form */}
        <form onSubmit={handleDirectSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Type any GitHub Username (e.g. your handle)"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            style={{
              flex: 1,
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '10px 14px',
              color: 'var(--text)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              background: 'transparent',
              border: '1px solid var(--accent)',
              color: 'var(--accent)',
              padding: '10px 16px',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            INSPECT
          </button>
        </form>
      </div>
    </div>
  );
};
