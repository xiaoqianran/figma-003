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

  return (
    <button
      type="button"
      onClick={() => onSelect?.(page)}
      className={`page-list-item${selectedState ? ' is-selected' : ''}`}
      title={`${page.title} · ${page.category}`}
    >
      {inFlow && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: 'var(--gody-amber)' }}
          title="In recent flow"
        />
      )}
      <span className="truncate flex-1 text-[13px] font-medium tracking-[-0.01em]">{page.title}</span>

      <span className="flex items-center gap-0.5 opacity-50 group-hover:opacity-100">
        {onCopyLink && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onCopyLink(page);
            }}
            className="px-1 py-0.5 text-[11px] hover:text-[var(--gody-amber-bright)] cursor-pointer select-none"
            title="Copy deep link"
            role="button"
          >
            ⧉
          </span>
        )}
        {toggleFav && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              toggleFav(page.id);
            }}
            className="px-0.5 text-sm leading-none hover:text-[var(--gody-amber-bright)] cursor-pointer select-none"
            title={favState ? 'Remove from favorites' : 'Add to favorites'}
            role="button"
          >
            {favState ? '★' : '☆'}
          </span>
        )}
      </span>
    </button>
  );
};
