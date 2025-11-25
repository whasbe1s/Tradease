import React from 'react';
import { ArrowUpRight, X, Star, Edit2, Check } from 'lucide-react';
import { LinkItem } from '../types';

interface LinkCardProps {
  link: LinkItem;
  selected: boolean;
  onToggleSelect: () => void;
  onDelete: (id: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
  onAddTag: (id: string, tag: string) => void;
  onTagClick: (tag: string) => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  selected,
  onToggleSelect,
  onDelete,
  onRemoveTag,
  onTagClick,
  onToggleFavorite,
  onEdit
}) => {
  const handleDelete = () => {
    if (window.confirm(`Delete "${link.title}"?`)) {
      onDelete(link.id);
    }
  };

  return (
    <div
      className={`
        group relative flex flex-col h-full bg-nothing-base border transition-all duration-200 rounded-none overflow-hidden
        ${selected
          ? 'border-nothing-accent shadow-[4px_4px_0px_0px_#FF6D1F] -translate-y-1'
          : 'border-nothing-dark shadow-[2px_2px_0px_0px_rgba(34,34,34,0.1)] hover:border-nothing-dark hover:shadow-[4px_4px_0px_0px_rgba(34,34,34,1)] hover:-translate-y-1'
        }
      `}
    >
      {/* Selection Checkbox - Absolute Top Left */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect();
        }}
        className="absolute top-0 left-0 p-3 z-20 cursor-pointer"
        role="checkbox"
        aria-checked={selected}
      >
        <div className={`w-3 h-3 border transition-colors rounded-none flex items-center justify-center ${selected ? 'bg-nothing-accent border-nothing-accent' : 'border-nothing-dark/30 bg-transparent group-hover:border-nothing-dark'
          }`}>
          {selected && <Check size={8} className="text-white" strokeWidth={4} />}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 p-5 flex flex-col h-full">

        {/* Top Row: Date & Actions */}
        <div className="flex justify-between items-start mb-4 pl-6">
          <span className="text-[10px] font-mono text-nothing-dim/60 pt-1">
            {new Date(link.created_at).toLocaleDateString()}
          </span>

          <div className="flex items-center gap-1 opacity-30 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 text-nothing-dim hover:text-nothing-dark transition-colors"
              aria-label="Edit Link"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`p-1.5 transition-colors ${link.favorite ? 'text-nothing-accent' : 'text-nothing-dim hover:text-nothing-accent'}`}
              aria-label={link.favorite ? "Unfavorite" : "Favorite"}
            >
              <Star size={14} className={link.favorite ? 'fill-current' : ''} />
            </button>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-nothing-dim hover:text-nothing-dark transition-colors"
              aria-label="Open Link"
            >
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* Middle: Title */}
        <div className="mb-4">
          <h3 className="text-lg font-bold font-mono uppercase leading-tight tracking-tight text-nothing-dark break-words select-all group-hover:text-black transition-colors">
            {link.title}
          </h3>
        </div>

        {/* Bottom: Description & Tags */}
        <div className="mt-auto flex flex-col gap-4">
          <p className="text-xs text-nothing-dark/60 font-sans leading-relaxed line-clamp-3 select-text">
            {link.description}
          </p>

          <div className="pt-3 border-t border-dashed border-nothing-dark/10 flex flex-wrap gap-x-3 gap-y-1 min-h-[1.5rem] items-center">
            {link.tags.map(tag => (
              <span
                key={tag}
                className="group/tag inline-flex items-center text-[10px] font-mono text-nothing-dim hover:text-nothing-dark cursor-pointer transition-colors select-none"
              >
                <span onClick={() => onTagClick(tag)} className="hover:underline decoration-dotted underline-offset-2">
                  #{tag}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTag(link.id, tag);
                  }}
                  className="ml-1 opacity-0 group-hover/tag:opacity-100 text-red-400 hover:text-red-600 transition-opacity focus:opacity-100"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X size={8} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};