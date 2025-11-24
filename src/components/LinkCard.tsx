import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Trash2, X, Plus, Check, Star } from 'lucide-react';
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
}

export const LinkCard: React.FC<LinkCardProps> = ({ 
  link, 
  selected,
  onToggleSelect,
  onDelete, 
  onRemoveTag, 
  onAddTag, 
  onTagClick,
  onToggleFavorite
}) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingTag && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingTag]);

  const submitTag = () => {
    const trimmed = newTag.trim().toLowerCase();
    if (trimmed) {
      onAddTag(link.id, trimmed);
    }
    setNewTag('');
    setIsAddingTag(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitTag();
    } else if (e.key === 'Escape') {
      setIsAddingTag(false);
      setNewTag('');
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
      {/* Selection Checkbox - Absolute & Minimal */}
      <div 
        onClick={(e) => {
           e.stopPropagation();
           onToggleSelect();
        }}
        className="absolute top-0 left-0 p-3 z-20 cursor-pointer"
        role="checkbox"
        aria-checked={selected}
      >
         <div className={`w-3 h-3 border transition-colors rounded-none flex items-center justify-center ${
            selected ? 'bg-nothing-accent border-nothing-accent' : 'border-nothing-dark/30 bg-transparent group-hover:border-nothing-dark'
         }`}>
            {selected && <Check size={8} className="text-white" strokeWidth={4} />}
         </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 p-5 pt-8 flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-start gap-3 mb-2">
            <h3 className="text-sm font-bold font-mono uppercase leading-tight tracking-tight text-nothing-dark break-words select-all">
                {link.title}
            </h3>
            
            <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite();
                    }}
                    className={`p-1.5 transition-colors ${link.favorite ? 'text-nothing-accent' : 'text-nothing-dim/40 hover:text-nothing-accent'}`}
                    aria-label={link.favorite ? "Unfavorite" : "Favorite"}
                >
                    <Star size={14} className={link.favorite ? 'fill-current' : ''} />
                </button>
                <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 text-nothing-dim/40 hover:text-nothing-dark transition-colors"
                    aria-label="Open Link"
                >
                    <ArrowUpRight size={14} />
                </a>
            </div>
        </div>

        {/* Description */}
        <p className="text-xs text-nothing-dark/60 font-sans leading-relaxed line-clamp-3 mb-4 select-text">
            {link.description}
        </p>
        
        {/* Footer Area */}
        <div className="mt-auto pt-3 border-t border-dashed border-nothing-dark/10 flex flex-col gap-3">
            
            {/* Tags */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 min-h-[1.5rem] items-center">
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
                
                {isAddingTag ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onBlur={submitTag}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent border-b border-nothing-accent text-[10px] font-mono w-16 focus:outline-none text-nothing-dark"
                        placeholder="tag..."
                    />
                ) : (
                    <button 
                        onClick={() => setIsAddingTag(true)}
                        className="text-nothing-dim/30 hover:text-nothing-accent transition-colors opacity-0 group-hover:opacity-100 flex items-center focus:opacity-100"
                        title="Add tag"
                    >
                        <Plus size={10} />
                    </button>
                )}
            </div>

            {/* Meta Row */}
            <div className="flex justify-between items-end">
                <span className="text-[9px] font-mono text-nothing-dim/40 select-none">
                    {new Date(link.createdAt).toLocaleDateString()}
                </span>
                <button 
                    onClick={() => onDelete(link.id)}
                    className="text-nothing-dim/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 focus:opacity-100 p-1"
                    aria-label="Delete link"
                >
                    <Trash2 size={12} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};