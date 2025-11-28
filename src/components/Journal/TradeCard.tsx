import React from 'react';
import { ArrowUpRight, X, Star, Edit2, Check, TrendingUp, TrendingDown, Target, MoreHorizontal } from 'lucide-react';
import { LinkItem } from '../../types';

interface TradeCardProps {
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

export const TradeCard: React.FC<TradeCardProps> = ({
    link,
    selected,
    onToggleSelect,
    onDelete,
    onRemoveTag,
    onTagClick,
    onToggleFavorite,
    onEdit
}) => {
    const isWin = link.outcome === 'win';
    const isLoss = link.outcome === 'loss';
    const isLong = link.direction === 'long';

    return (
        <div
            className={`
        group relative flex flex-col h-full bg-nothing-base/50 backdrop-blur-sm border transition-all duration-200 rounded-xl overflow-hidden
        ${selected
                    ? 'border-nothing-accent shadow-[0_0_0_1px_rgba(163,176,135,0.5)]'
                    : 'border-nothing-dark/10 hover:border-nothing-dark/30 hover:shadow-lg'
                }
      `}
        >
            {/* Selection Checkbox */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect();
                }}
                className="absolute top-3 left-3 z-20 cursor-pointer"
                role="checkbox"
                aria-checked={selected}
            >
                <div className={`w-3 h-3 border transition-colors rounded-sm flex items-center justify-center ${selected ? 'bg-nothing-accent border-nothing-accent' : 'border-nothing-dark/30 bg-transparent group-hover:border-nothing-dark'
                    }`}>
                    {selected && <Check size={8} className="text-nothing-base" strokeWidth={4} />}
                </div>
            </div>

            {/* Card Content */}
            <div className="flex-1 p-4 flex flex-col h-full relative">
                {/* Background Dot Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#435663 1px, transparent 1px)',
                        backgroundSize: '8px 8px'
                    }}
                ></div>

                {/* Top Row: Date & Actions */}
                <div className="flex justify-between items-start mb-3 pl-6 relative z-10">
                    <span className="text-[9px] font-mono text-nothing-dark/40 pt-0.5">
                        {new Date(link.created_at).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            className="p-1 text-nothing-dark/40 hover:text-nothing-dark transition-colors"
                        >
                            <Edit2 size={12} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite();
                            }}
                            className={`p-1 transition-colors ${link.favorite ? 'text-nothing-accent' : 'text-nothing-dark/40 hover:text-nothing-accent'}`}
                        >
                            <Star size={12} className={link.favorite ? 'fill-current' : ''} />
                        </button>
                    </div>
                </div>

                {/* Main: Pair & Direction */}
                <div className="mb-4 flex items-center justify-between relative z-10">
                    <h3 className="text-lg font-bold font-mono uppercase tracking-tight text-nothing-dark">
                        {link.pair || link.title}
                    </h3>
                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${isLong
                        ? 'bg-nothing-dark/5 border-nothing-dark/20 text-nothing-dark'
                        : 'bg-nothing-accent/5 border-nothing-accent/20 text-nothing-accent'
                        }`}>
                        {isLong ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        <span className="text-[9px] font-bold uppercase tracking-wider">{link.direction}</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4 relative z-10">
                    <div className="bg-nothing-dark/5 p-2 rounded border border-nothing-dark/5">
                        <div className="text-[9px] font-mono uppercase tracking-wider text-nothing-dark/40 mb-1">Outcome</div>
                        <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${isWin ? 'bg-nothing-dark' : isLoss ? 'bg-nothing-accent' : 'bg-nothing-dark/20'}`} />
                            <span className="text-xs font-bold font-mono uppercase text-nothing-dark/80">
                                {link.outcome}
                            </span>
                        </div>
                    </div>
                    <div className="bg-nothing-dark/5 p-2 rounded border border-nothing-dark/5">
                        <div className="text-[9px] font-mono uppercase tracking-wider text-nothing-dark/40 mb-1">PnL</div>
                        <div className={`text-xs font-bold font-mono ${(link.pnl || 0) > 0 ? 'text-nothing-dark' : (link.pnl || 0) < 0 ? 'text-nothing-accent' : 'text-nothing-dark/40'
                            }`}>
                            {link.pnl ? `${(link.pnl || 0) > 0 ? '+' : ''}$${link.pnl}` : '-'}
                        </div>
                    </div>
                </div>

                {/* Notes/Description */}
                <div className="mt-auto flex flex-col gap-3 relative z-10">
                    <p className="text-[10px] text-nothing-dark/60 font-mono leading-relaxed line-clamp-2 select-text min-h-[2.5em]">
                        {link.description || 'NO_NOTES_RECORDED'}
                    </p>

                    <div className="pt-2 border-t border-dashed border-nothing-dark/10 flex flex-wrap gap-1.5">
                        {link.tags.slice(0, 3).map(tag => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-1.5 py-0.5 rounded bg-nothing-dark/5 border border-nothing-dark/5 text-[9px] font-mono text-nothing-dark/60 uppercase tracking-wider"
                            >
                                #{tag}
                            </span>
                        ))}
                        {link.tags.length > 3 && (
                            <span className="text-[9px] font-mono text-nothing-dark/40 self-center">
                                +{link.tags.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
