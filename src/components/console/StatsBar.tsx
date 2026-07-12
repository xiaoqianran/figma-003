import React from 'react';

interface StatsBarProps {
  total?: number;
  migrated?: number;
  favoritesCount?: number;
  recentCount?: number;
  flowLength?: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  total = 0,
  migrated = 0,
  favoritesCount = 0,
  recentCount = 0,
  flowLength = 0,
}) => (
  <div className="lab-header-stats" aria-label="Console stats">
    <span className="lab-stat-pill">
      <strong>{total}</strong> prototypes
    </span>
    <span className="lab-stat-pill lab-stat-pill--accent">
      <strong>{migrated}/{total}</strong> React
    </span>
    {favoritesCount > 0 && (
      <span className="lab-stat-pill">
        <strong>{favoritesCount}</strong> favs
      </span>
    )}
    {recentCount > 0 && (
      <span className="lab-stat-pill">
        <strong>{recentCount}</strong> recent
      </span>
    )}
    {flowLength > 0 && (
      <span className="lab-stat-pill">
        <strong>{flowLength}</strong> flow
      </span>
    )}
  </div>
);
