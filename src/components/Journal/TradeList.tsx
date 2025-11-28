import React, { useState } from 'react';
import { LinkItem } from '../../types';
import {
    ArrowRight,
    Check,
    ArrowUpDown,
    ChevronDown,
    ChevronRight,
    MoreHorizontal
} from 'lucide-react';
import { ContextMenu } from '../UI/ContextMenu';
import { TradeDetails } from './TradeDetails';
import { AnimatePresence, motion } from 'framer-motion';

interface TradeListProps {
    links: LinkItem[];
    selectedIds: Set<string>;
    onToggleSelection: (id: string) => void;
    onSelectAll: () => void;
    onDelete: (id: string) => void;
    onEdit: (link: LinkItem) => void;
    onToggleFavorite: (id: string) => void;
    sortMode: 'newest' | 'oldest' | 'pnl-high' | 'pnl-low' | 'pair-az';
    setSortMode: (mode: 'newest' | 'oldest' | 'pnl-high' | 'pnl-low' | 'pair-az') => void;
}

interface DateGroup {
    label: string;
    trades: LinkItem[];
    totalPnL: number;
    wins: number;
    losses: number;
}

export const TradeList: React.FC<TradeListProps> = ({
    links,
    selectedIds,
    onToggleSelection,
    onSelectAll,
    onDelete,
    onEdit,
    onToggleFavorite,
    sortMode,
    setSortMode
}) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        trade: LinkItem;
    } | null>(null);
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

    if (links.length === 0) {
        return null; // Handled by parent
    }

    const handleSort = (column: 'date' | 'pnl') => {
        if (column === 'date') {
            setSortMode(sortMode === 'newest' ? 'oldest' : 'newest');
        } else if (column === 'pnl') {
            setSortMode(sortMode === 'pnl-high' ? 'pnl-low' : 'pnl-high');
        }
    };

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const handleContextMenu = (e: React.MouseEvent, trade: LinkItem) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            trade
        });
    };

    const handleDuplicate = (trade: LinkItem) => {
        console.log('Duplicate trade:', trade);
    };

    const toggleGroup = (label: string) => {
        const newCollapsed = new Set(collapsedGroups);
        if (newCollapsed.has(label)) {
            newCollapsed.delete(label);
        } else {
            newCollapsed.add(label);
        }
        setCollapsedGroups(newCollapsed);
    };

    // Group trades by date
    const groupTradesByDate = (): DateGroup[] => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const groups: { [key: string]: LinkItem[] } = {
            'TODAY': [],
            'YESTERDAY': [],
            'THIS_WEEK': [],
            'OLDER': []
        };

        links.forEach(trade => {
            const tradeDate = new Date(trade.created_at);
            const tradeDateOnly = new Date(tradeDate.getFullYear(), tradeDate.getMonth(), tradeDate.getDate());

            if (tradeDateOnly.getTime() === today.getTime()) {
                groups['TODAY'].push(trade);
            } else if (tradeDateOnly.getTime() === yesterday.getTime()) {
                groups['YESTERDAY'].push(trade);
            } else if (tradeDateOnly >= weekAgo) {
                groups['THIS_WEEK'].push(trade);
            } else {
                groups['OLDER'].push(trade);
            }
        });

        return Object.entries(groups)
            .filter(([, trades]) => trades.length > 0)
            .map(([label, trades]) => {
                const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
                const wins = trades.filter(t => t.outcome === 'win').length;
                const losses = trades.filter(t => t.outcome === 'loss').length;
                return { label, trades, totalPnL, wins, losses };
            });
    };

    const dateGroups = groupTradesByDate();
    const hasSelection = selectedIds.size > 0;

    return (
        <>
            {/* Desktop View (Grid) */}
            <div className="hidden md:block w-full min-w-[800px]">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-nothing-dark/10 text-[9px] uppercase tracking-[0.2em] text-nothing-dark/40 font-mono select-none sticky top-0 bg-nothing-base/95 backdrop-blur-md z-20">
                    <div className="col-span-1 flex items-center justify-center">
                        <div
                            onClick={onSelectAll}
                            className={`w-3 h-3 border cursor-pointer transition-all duration-200 flex items-center justify-center rounded-sm ${selectedIds.size > 0 && selectedIds.size === links.length
                                ? 'bg-nothing-accent border-nothing-accent'
                                : 'border-nothing-dark/30 hover:border-nothing-dark'
                                }`}
                        >
                            {selectedIds.size > 0 && selectedIds.size === links.length && <Check size={8} className="text-nothing-base" strokeWidth={4} />}
                        </div>
                    </div>
                    <div className="col-span-2">PAIR / TIME</div>
                    <div className="col-span-1 text-center">SIDE</div>
                    <div className="col-span-3 text-right pr-4">ENTRY / EXIT</div>
                    <div className="col-span-2 text-right">PNL</div>
                    <div className="col-span-2 text-center">OUTCOME</div>
                    <div className="col-span-1"></div>
                </div>

                {/* Date Groups */}
                <div className="flex flex-col">
                    {dateGroups.map(group => (
                        <div key={group.label} className="relative">
                            {/* Group Header */}
                            <div
                                className="px-4 py-1.5 bg-nothing-dark/5 border-b border-nothing-dark/5 flex items-center justify-between cursor-pointer hover:bg-nothing-dark/10 transition-colors sticky top-[33px] z-10"
                                onClick={() => toggleGroup(group.label)}
                            >
                                <div className="flex items-center gap-2">
                                    {collapsedGroups.has(group.label) ? (
                                        <ChevronRight size={10} className="text-nothing-dark/40" />
                                    ) : (
                                        <ChevronDown size={10} className="text-nothing-dark/40" />
                                    )}
                                    <span className="text-[9px] font-mono font-bold text-nothing-dark tracking-wider">{group.label}</span>
                                    <span className="text-[9px] font-mono text-nothing-dark/40">[{group.trades.length}]</span>
                                </div>
                                <div className="flex items-center gap-3 text-[9px] font-mono">
                                    <span className="text-nothing-dark/50">
                                        {group.wins}W / {group.losses}L
                                    </span>
                                    <span className={`font-bold ${group.totalPnL > 0 ? 'text-nothing-dark' : group.totalPnL < 0 ? 'text-nothing-accent' : 'text-nothing-dark/40'}`}>
                                        {group.totalPnL > 0 ? '+' : ''}${group.totalPnL.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Trades in Group */}
                            {!collapsedGroups.has(group.label) && group.trades.map((trade) => {
                                const isWin = trade.outcome === 'win';
                                const isLoss = trade.outcome === 'loss';
                                const isLong = trade.direction === 'long';
                                const isSelected = selectedIds.has(trade.id);
                                const isExpanded = expandedRows.has(trade.id);
                                const pnl = trade.pnl || 0;

                                return (
                                    <div key={trade.id} className="group/row">
                                        <div
                                            onClick={() => toggleRow(trade.id)}
                                            onContextMenu={(e) => handleContextMenu(e, trade)}
                                            className={`
                                                grid grid-cols-12 gap-4 px-4 py-2.5 items-center cursor-pointer transition-all duration-200 border-b border-nothing-dark/5
                                                ${isSelected ? 'bg-nothing-accent/5' : 'hover:bg-nothing-dark/5'}
                                                ${isExpanded ? 'bg-nothing-dark/5 border-nothing-dark/10' : ''}
                                            `}
                                        >
                                            {/* Checkbox */}
                                            <div className="col-span-1 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); onToggleSelection(trade.id); }}>
                                                <div className={`
                                                    w-3 h-3 border transition-all duration-200 flex items-center justify-center rounded-sm
                                                    ${isSelected
                                                        ? 'bg-nothing-accent border-nothing-accent opacity-100'
                                                        : hasSelection
                                                            ? 'border-nothing-dark/30 hover:border-nothing-dark opacity-100'
                                                            : 'border-nothing-dark/30 hover:border-nothing-dark opacity-0 group-hover/row:opacity-100'
                                                    }
                                                `}>
                                                    {isSelected && <Check size={8} className="text-nothing-base" strokeWidth={4} />}
                                                </div>
                                            </div>

                                            {/* Pair & Time */}
                                            <div className="col-span-2 flex flex-col">
                                                <span className="font-bold text-nothing-dark text-xs tracking-tight font-mono">
                                                    {trade.pair || trade.title}
                                                </span>
                                                <span className="text-[9px] font-mono text-nothing-dark/40">
                                                    {new Date(trade.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            {/* Direction */}
                                            <div className="col-span-1 text-center">
                                                <span className={`
                                                    text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm border
                                                    ${isLong
                                                        ? 'text-nothing-dark border-nothing-dark/20 bg-nothing-dark/5'
                                                        : 'text-nothing-accent border-nothing-accent/20 bg-nothing-accent/5'}
                                                `}>
                                                    {trade.direction === 'long' ? 'LONG' : 'SHRT'}
                                                </span>
                                            </div>

                                            {/* Prices */}
                                            <div className="col-span-3 flex items-center justify-end gap-2 pr-4 font-mono text-[10px]">
                                                <span className="text-nothing-dark/50">{trade.entry_price?.toFixed(5) || '---'}</span>
                                                <ArrowRight size={8} className="text-nothing-dark/20" />
                                                <span className="text-nothing-dark/80">{trade.exit_price?.toFixed(5) || '---'}</span>
                                            </div>

                                            {/* PnL */}
                                            <div className="col-span-2 text-right">
                                                <span className={`font-mono font-bold text-xs tracking-tight ${pnl > 0 ? 'text-nothing-dark' : pnl < 0 ? 'text-nothing-accent' : 'text-nothing-dark/40'}`}>
                                                    {pnl > 0 ? '+' : ''}${pnl.toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Outcome */}
                                            <div className="col-span-2 flex justify-center gap-1">
                                                {[...Array(3)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-1 h-1 rounded-full ${isWin ? (i < 3 ? 'bg-nothing-dark' : 'bg-nothing-dark/20') :
                                                            isLoss ? (i < 1 ? 'bg-nothing-accent' : 'bg-nothing-accent/20') :
                                                                'bg-nothing-dark/10'
                                                            }`}
                                                    />
                                                ))}
                                            </div>

                                            {/* Actions */}
                                            <div className="col-span-1 flex justify-end opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleContextMenu(e, trade); }}
                                                    className="p-1 hover:bg-nothing-dark/10 rounded"
                                                >
                                                    <MoreHorizontal size={12} className="text-nothing-dark/60" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden bg-nothing-dark/[0.02]"
                                                >
                                                    <TradeDetails trade={trade} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile View (Cards) */}
            <div className="block md:hidden w-full pb-20">
                {dateGroups.map(group => (
                    <div key={group.label} className="mb-6">
                        {/* Group Header */}
                        <div className="px-4 py-2 flex items-center justify-between sticky top-0 bg-nothing-base/95 backdrop-blur-md z-20 border-b border-nothing-dark/5 mb-2">
                            <span className="text-[10px] font-mono font-bold text-nothing-dark tracking-wider">{group.label}</span>
                            <span className={`text-[10px] font-mono font-bold ${group.totalPnL > 0 ? 'text-nothing-dark' : group.totalPnL < 0 ? 'text-nothing-accent' : 'text-nothing-dark/40'}`}>
                                {group.totalPnL > 0 ? '+' : ''}${group.totalPnL.toFixed(2)}
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-3 px-2">
                            {group.trades.map(trade => {
                                const isWin = trade.outcome === 'win';
                                const isLoss = trade.outcome === 'loss';
                                const isLong = trade.direction === 'long';
                                const pnl = trade.pnl || 0;
                                const isExpanded = expandedRows.has(trade.id);

                                return (
                                    <div
                                        key={trade.id}
                                        onClick={() => toggleRow(trade.id)}
                                        onContextMenu={(e) => handleContextMenu(e, trade)}
                                        className={`
                                            bg-nothing-dark/5 rounded-2xl p-4 border border-nothing-dark/5 active:scale-[0.98] transition-all
                                            ${isExpanded ? 'bg-nothing-dark/10 border-nothing-dark/10' : ''}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-nothing-dark font-mono text-lg">
                                                    {trade.pair || trade.title}
                                                </span>
                                                <span className={`
                                                    text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm border
                                                    ${isLong
                                                        ? 'text-nothing-dark border-nothing-dark/20 bg-nothing-dark/5'
                                                        : 'text-nothing-accent border-nothing-accent/20 bg-nothing-accent/5'}
                                                `}>
                                                    {trade.direction === 'long' ? 'LONG' : 'SHRT'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`font-mono font-bold text-lg ${pnl > 0 ? 'text-nothing-dark' : pnl < 0 ? 'text-nothing-accent' : 'text-nothing-dark/40'}`}>
                                                    {pnl > 0 ? '+' : ''}${pnl.toFixed(2)}
                                                </span>
                                                <span className="text-[10px] font-mono text-nothing-dark/40">
                                                    {new Date(trade.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-[10px] font-mono text-nothing-dark/60">
                                                    <span>Entry: {trade.entry_price?.toFixed(5) || '---'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-mono text-nothing-dark/60">
                                                    <span>Exit: {trade.exit_price?.toFixed(5) || '---'}</span>
                                                </div>
                                            </div>

                                            {/* Outcome Dots */}
                                            <div className="flex gap-1">
                                                {[...Array(3)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-1.5 h-1.5 rounded-full ${isWin ? (i < 3 ? 'bg-nothing-dark' : 'bg-nothing-dark/20') :
                                                            isLoss ? (i < 1 ? 'bg-nothing-accent' : 'bg-nothing-accent/20') :
                                                                'bg-nothing-dark/10'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Expanded Details Mobile */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden mt-4 pt-4 border-t border-nothing-dark/10"
                                                >
                                                    <TradeDetails trade={trade} />
                                                    <div className="flex justify-end gap-2 mt-4">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onEdit(trade); }}
                                                            className="px-4 py-2 bg-nothing-dark/10 rounded-lg text-xs font-mono font-bold text-nothing-dark"
                                                        >
                                                            EDIT
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onDelete(trade.id); }}
                                                            className="px-4 py-2 bg-nothing-accent/10 rounded-lg text-xs font-mono font-bold text-nothing-accent"
                                                        >
                                                            DELETE
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Context Menu */}
            <AnimatePresence>
                {contextMenu && (
                    <ContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        onClose={() => setContextMenu(null)}
                        onEdit={() => onEdit(contextMenu.trade)}
                        onDelete={() => onDelete(contextMenu.trade.id)}
                        onDuplicate={() => handleDuplicate(contextMenu.trade)}
                        onToggleFavorite={() => onToggleFavorite(contextMenu.trade.id)}
                        isFavorite={contextMenu.trade.favorite}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
