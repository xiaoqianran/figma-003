import React from 'react';
import type { PageDefinition } from '../../pageRegistry';

interface InfoPanelProps {
  selectedPage?: PageDefinition | null;
  favorites?: string[];
  flowHistory?: string[];
  onSelectPage?: (page: PageDefinition) => void;
  onToggleFavorite?: (id: string) => void;
  onCopyLink?: (page: PageDefinition) => void;
  onCopyStandaloneLink?: (page: PageDefinition) => void;
  onStartFlow?: (page: PageDefinition) => void;
  page?: PageDefinition | null;
  onNavigate?: (id: string) => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  selectedPage,
  page,
  onSelectPage,
  onNavigate,
  onToggleFavorite,
  onCopyLink,
  onCopyStandaloneLink,
  onStartFlow,
}) => {
  const current = selectedPage || page || null;

  if (!current) {
    return (
      <div className="lab-meta-card">
        <div className="lab-meta-empty">
          从列表选择原型，可查看详情、复制链接或启动演示流程。
        </div>
      </div>
    );
  }

  return (
    <div className="lab-meta-card">
      <div className="lab-meta-title">{current.title}</div>
      <div className="lab-meta-desc">{current.description}</div>
      <span className="lab-meta-tag">{current.category}</span>

      <div className="lab-meta-actions">
        <button
          type="button"
          onClick={() => (onSelectPage ? onSelectPage(current) : onNavigate?.(current.id))}
          className="lab-btn lab-btn--primary"
        >
          打开
        </button>
        {onToggleFavorite && (
          <button type="button" onClick={() => onToggleFavorite(current.id)} className="lab-btn">
            ★ 收藏
          </button>
        )}
        {onCopyLink && (
          <button type="button" onClick={() => onCopyLink(current)} className="lab-btn">
            复制链接
          </button>
        )}
        {onCopyStandaloneLink && (
          <button type="button" onClick={() => onCopyStandaloneLink(current)} className="lab-btn">
            独立预览
          </button>
        )}
        {onStartFlow && (
          <button type="button" onClick={() => onStartFlow(current)} className="lab-btn">
            启动流程
          </button>
        )}
      </div>
    </div>
  );
};
