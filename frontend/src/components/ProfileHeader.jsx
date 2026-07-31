import React from 'react';

/**
 * ProfileHeader Micro-Component
 * Displays GitHub user avatar with clearance badge, status telemetry chips, and bio.
 * All styling strictly controlled via CSS variables: --bg, --surface, --accent, --border, --text
 */
export const ProfileHeader = ({ profile }) => {
  const p = profile || {
    login: 'developer',
    name: 'GitHub Developer',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Architecting next-gen systems and software.',
    location: 'Global Server Cluster',
    public_repos: 12,
    followers: 1280
  };

  const avatarUrl = p.avatar_url || p.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  const username = p.name || p.login || 'GitHub Developer';
  const handle = p.login ? `@${p.login}` : '';
  const bio = p.bio || 'Architecting next-gen systems and software.';
  const location = p.location || 'Global Server Cluster';
  const publicRepos = p.public_repos !== undefined ? p.public_repos : 0;
  const followers = p.followers !== undefined ? p.followers : 0;
  const htmlUrl = p.html_url || `https://github.com/${p.login || ''}`;

  return (
    <div className="profile-hero">
      <div className="hero-grid">
        <div className="avatar-container">
          <img 
            src={avatarUrl} 
            alt={username} 
            className="avatar-img" 
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=300&q=80';
            }}
          />
          <div className="clearance-badge">LEVEL_4_CLEARANCE</div>
        </div>

        <div className="profile-details">
          <div className="profile-header-meta">
            <span className="status-indicator"></span>
            <h1 className="profile-name">{username}</h1>
            {handle && <span className="profile-handle" style={{ color: 'var(--accent)', marginLeft: '12px', fontSize: '14px' }}>{handle}</span>}
          </div>

          <p className="profile-bio">{bio}</p>

          <div className="profile-tags">
            <span className="meta-chip">📍 {location}</span>
            <span className="meta-chip">📦 {publicRepos} PUBLIC_REPOS</span>
            <span className="meta-chip">👥 {followers} NETWORK_FOLLOWERS</span>
            <a 
              href={htmlUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="meta-chip" 
              style={{ textDecoration: 'none', color: 'var(--accent)' }}
            >
              🔗 GITHUB_PROFILE ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
