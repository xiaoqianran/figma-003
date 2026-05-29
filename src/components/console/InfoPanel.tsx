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
  // legacy
  page?: PageDefinition | null;
  onNavigate?: (id: string) => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ 
  selectedPage, page, onSelectPage, onNavigate, onToggleFavorite, onCopyLink, onCopyStandaloneLink, onStartFlow 
}) => {
  const current = selectedPage || page || null;
  if (!current) return <div style={{ color: '#6E6A61', fontSize: 12 }}>Select a prototype from the list</div>;
  return (
    <div>
      <div style={{ color: '#0A0908', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{current.title}</div>
      <div style={{ fontSize: 11, color: '#3F3D37', lineHeight: 1.3 }}>{current.description}</div>
      <div style={{ marginTop: 10, fontSize: 10, color: '#6E6A61' }}>Category: {current.category}</div>
      <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button
          onClick={() => (onSelectPage || onNavigate) ? (onSelectPage ? onSelectPage(current) : onNavigate?.(current.id)) : null}
          className="tb-btn"
          style={{ fontSize: 11 }}
        >
          Open
        </button>
        {onToggleFavorite && (
          <button onClick={() => onToggleFavorite(current.id)} className="tb-btn" style={{ fontSize: 11 }}>★ Fav</button>
        )}
        {onCopyLink && (
          <button onClick={() => onCopyLink(current)} className="tb-btn" style={{ fontSize: 11 }}>Copy Link</button>
        )}
        {onCopyStandaloneLink && (
          <button onClick={() => onCopyStandaloneLink(current)} className="tb-btn" style={{ fontSize: 11, borderColor: 'rgba(254,204,42,0.35)' }}>Copy Standalone</button>
        )}
        {onStartFlow && (
          <button onClick={() => onStartFlow(current)} className="tb-btn" style={{ fontSize: 11 }}>Start Flow</button>
        )}
      </div>
    </div>
  );
};
