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
          Select a prototype from the list to inspect details, copy links, or start a demo flow.
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
          Open
        </button>
        {onToggleFavorite && (
          <button type="button" onClick={() => onToggleFavorite(current.id)} className="lab-btn">
            ★ Favorite
          </button>
        )}
        {onCopyLink && (
          <button type="button" onClick={() => onCopyLink(current)} className="lab-btn">
            Copy link
          </button>
        )}
        {onCopyStandaloneLink && (
          <button type="button" onClick={() => onCopyStandaloneLink(current)} className="lab-btn">
            Standalone
          </button>
        )}
        {onStartFlow && (
          <button type="button" onClick={() => onStartFlow(current)} className="lab-btn">
            Start flow
          </button>
        )}
      </div>
    </div>
  );
};
