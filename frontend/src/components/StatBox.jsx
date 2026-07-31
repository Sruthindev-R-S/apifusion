import React from 'react';

/**
 * StatBox Micro-Component
 * Displays key telemetry metric with label.
 * Strictly uses CSS variables --surface, --border, --accent, --text
 */
export const StatBox = ({ label, value }) => {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};
