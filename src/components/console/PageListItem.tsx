import React from 'react';
import type { PageDefinition } from '../../pageRegistry';

interface Props {
  page: PageDefinition;
  isSelected?: boolean;
  isFavorite?: boolean;
  isInFlow?: boolean;
  onSelect?: (page: PageDefinition) => void;
  onToggleFavorite?: (id: string) => void;
  onCopyLink?: (page: PageDefinition) => void;
  // legacy prop names for compatibility
  selected?: boolean;
  onToggleFav?: (id: string) => void;
}

export const PageListItem: React.FC<Props> = ({
  page,
  isSelected,
  isFavorite,
  isInFlow,
  onSelect,
  onToggleFavorite,
  onCopyLink,
  selected,
  onToggleFav,
}) => {
  const selectedState = isSelected ?? selected ?? false;
  const favState = isFavorite ?? false;
  const inFlow = isInFlow ?? false;
  const toggleFav = onToggleFavorite ?? onToggleFav;
  const handleSelect = () => onSelect?.(page);
  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFav?.(page.id);
  };
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyLink?.(page);
  };

  return (
    <button
      onClick={handleSelect}
      className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 console-font group ${
        selectedState ? 'bg-[#1F1E1B] text-[#fecc2a] border-l-2 border-[#fecc2a]' : 'hover:bg-[#1A1916] text-[#EDEBE5]'
      }`}
      title={`${page.title} • ${page.category}`}
    >
      {/* Flow indicator dot */}
      {inFlow && (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#fecc2a] flex-shrink-0" title="In recent flow" />
      )}
      <span className="truncate flex-1 text-[13px]">{page.title}</span>

      {/* Action cluster (only visible on hover or when active) */}
      <span className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
        {onCopyLink && (
          <span
            onClick={handleCopy}
            className="px-1 py-0.5 text-[11px] hover:text-[#fecc2a] cursor-pointer select-none"
            title="Copy deep link"
          >
            ⧉
          </span>
        )}
        {toggleFav && (
          <span
            onClick={handleToggleFav}
            className="px-0.5 text-sm leading-none hover:text-[#fecc2a] cursor-pointer select-none"
            title={favState ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favState ? '★' : '☆'}
          </span>
        )}
      </span>
    </button>
  );
};
