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
  <div className="lab-header-stats" aria-label="控制台统计">
    <span className="lab-stat-pill">
      <strong>{total}</strong> 个原型
    </span>
    <span className="lab-stat-pill lab-stat-pill--accent">
      <strong>{migrated}/{total}</strong> 已迁移
    </span>
    {favoritesCount > 0 && (
      <span className="lab-stat-pill">
        <strong>{favoritesCount}</strong> 收藏
      </span>
    )}
    {recentCount > 0 && (
      <span className="lab-stat-pill">
        <strong>{recentCount}</strong> 最近
      </span>
    )}
    {flowLength > 0 && (
      <span className="lab-stat-pill">
        <strong>{flowLength}</strong> 流程
      </span>
    )}
  </div>
);
