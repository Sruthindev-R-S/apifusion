import React from 'react';

/**
 * TimelineNode Micro-Component (Production Log Entry)
 * Renders individual commit/deploy timeline node with dynamic status glow.
 */
export const TimelineNode = ({ log }) => {
  if (!log) return null;

  const { timestamp, title, description, message, isActive } = log;
  const logText = description || message || '';

  return (
    <div className={`timeline-item ${isActive ? 'active' : ''}`}>
      <div className="timeline-node-dot" />
      <div className="timeline-timestamp">{timestamp}</div>
      <h4 className="timeline-title">{title}</h4>
      <p className="timeline-desc">{logText}</p>
    </div>
  );
};
