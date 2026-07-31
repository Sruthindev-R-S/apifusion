import React from 'react';

/**
 * TMDBPaletteSelector Micro-Component
 * Dynamically injects TMDB color palettes into document root as CSS variables:
 * --bg, --surface, --accent, --border, --text.
 */
export const TMDBPaletteSelector = ({ themes = [], currentThemeId, onSelectTheme }) => {
  if (!themes || themes.length === 0) return null;

  return (
    <div className="tmdb-theme-bar">
      <div className="bar-label">
        <span>🎬 TMDB THEME INJECTOR:</span>
      </div>

      <div className="palette-chips">
        {themes.map((theme) => (
          <button
            key={theme.id || theme.name}
            className={`palette-btn ${currentThemeId === theme.id ? 'active' : ''}`}
            onClick={() => onSelectTheme(theme)}
            title={`Apply ${theme.name || theme.title} palette to CSS variables`}
          >
            <span 
              className="palette-swatch" 
              style={{ backgroundColor: theme.colors?.['--accent'] || '#00ff66' }}
            />
            {theme.name || theme.themeName || theme.title}
          </button>
        ))}
      </div>
    </div>
  );
};
