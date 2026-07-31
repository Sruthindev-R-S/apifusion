import React from 'react';

/**
 * CollaboratorChip Micro-Component (Cast & Crew Member)
 * Renders contributor avatar, handle, role, and contribution count.
 */
export const CollaboratorChip = ({ collaborator }) => {
  if (!collaborator) return null;

  const handle = collaborator.login || collaborator.username || 'Contributor';
  const role = collaborator.role || `${collaborator.contributions || 1} Commits`;
  const avatarUrl = collaborator.avatar_url || collaborator.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

  return (
    <div className="collaborator-chip">
      <img 
        src={avatarUrl} 
        alt={handle} 
        className="collaborator-avatar"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';
        }}
      />
      <div className="collaborator-info">
        <div className="collaborator-handle">@{handle}</div>
        <div className="collaborator-role">{role}</div>
      </div>
    </div>
  );
};
