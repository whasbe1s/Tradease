import React from 'react';
import { Filter, ArrowUpDown, CheckSquare, Square } from 'lucide-react';

interface ControlsProps {
    filteredCount: number;
    selectedCount: number;
    sortMode: 'newest' | 'oldest' | 'pnl-high' | 'pnl-low' | 'pair-az';
    setSortMode: (mode: 'newest' | 'oldest' | 'pnl-high' | 'pnl-low' | 'pair-az') => void;
    onSelectAll: () => void;
    onClearSelection: () => void;
    areAllSelected: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
    filteredCount,
    selectedCount,
    sortMode,
    setSortMode,
    onSelectAll,
    onClearSelection,
    areAllSelected
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-nothing-dark/50 mb-2 sm:mb-0">
                <span>{filteredCount} ITEMS</span>
                {selectedCount > 0 && (
                    <>
                        <span>/</span>
                        <span className="text-nothing-accent">{selectedCount} SELECTED</span>
                    </>
                )}
            </div>

            {/* Control Unit */}
            <div className="flex items-stretch border border-nothing-dark bg-nothing-base shadow-[2px_2px_0px_0px_rgba(34,34,34,0.1)] rounded-none overflow-hidden">


                {/* Sort Dropdown Container */}
                <div className="relative border-r border-nothing-dark/10 bg-nothing-base hover:bg-nothing-surface transition-colors flex items-center">
                    <div className="absolute left-3 pointer-events-none text-nothing-dark">
                        <Filter size={12} />
                    </div>
                    <select
                        value={sortMode}
                        onChange={(e) => setSortMode(e.target.value as any)}
                        className="appearance-none bg-transparent pl-9 pr-8 py-2 text-xs font-mono uppercase cursor-pointer focus:outline-none text-nothing-dark w-full h-full rounded-none"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="pnl-high">Highest PnL</option>
                        <option value="pnl-low">Lowest PnL</option>
                        <option value="pair-az">Pair A-Z</option>
                    </select>
                    <div className="absolute right-2 pointer-events-none text-nothing-dark/50">
                        <ArrowUpDown size={10} />
                    </div>
                </div>

                {/* Select All */}
                <button
                    onClick={areAllSelected && filteredCount > 0 ? onClearSelection : onSelectAll}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase hover:bg-nothing-surface text-nothing-dark transition-colors"
                >
                    {areAllSelected && filteredCount > 0 ? (
                        <CheckSquare size={14} />
                    ) : (
                        <Square size={14} />
                    )}
                    <span className="hidden sm:inline">All</span>
                </button>
            </div>
        </div>
    );
};
