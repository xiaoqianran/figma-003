import React from 'react';

interface StatsBarProps {
  total?: number;
  migrated?: number;
  favoritesCount?: number;
  recentCount?: number;
  flowLength?: number;
}

export const StatsBar: React.FC<StatsBarProps> = () => (
  <div style={{ fontSize: 10, color: '#6E6A61', display: 'flex', gap: 12 }}>
    <span>44 PROTOTYPES</span>
    <span>100% REACT</span>
  </div>
);
