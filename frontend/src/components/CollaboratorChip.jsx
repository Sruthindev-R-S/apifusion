import React from 'react';

/**
 * CollaboratorChip Micro-Component (Cast & Crew Member)
 * Renders contributor avatar, full display name, handle, role, and clickable profile link.
 */
export const CollaboratorChip = ({ collaborator }) => {
  if (!collaborator) return null;

  const handle = collaborator.login || collaborator.username || 'developer';
  const displayName = collaborator.name || handle;
  const role = collaborator.role || `${collaborator.contributions || 1} Commit${(collaborator.contributions || 1) !== 1 ? 's' : ''}`;
  const avatarUrl = collaborator.avatar_url || collaborator.avatarUrl || `https://github.com/${handle}.png`;
  const profileUrl = collaborator.html_url || `https://github.com/${handle}`;

  return (
    <a 
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="collaborator-chip"
      style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
    >
      <img 
        src={avatarUrl} 
        alt={displayName} 
        className="collaborator-avatar"
        onError={(e) => {
          e.target.src = `https://github.com/${handle}.png`;
        }}
      />
      <div className="collaborator-info">
        <div className="collaborator-name">{displayName}</div>
        <div className="collaborator-handle">@{handle}</div>
        <div className="collaborator-role">{role}</div>
      </div>
    </a>
  );
};
