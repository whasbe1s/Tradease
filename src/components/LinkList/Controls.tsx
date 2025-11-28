import React from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { Dropdown } from '../UI/Dropdown';

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
                <div className="w-48 border-r border-nothing-dark/10 bg-nothing-base">
                    <Dropdown
                        value={sortMode}
                        onChange={(val) => setSortMode(val as any)}
                        options={[
                            { value: 'newest', label: 'Newest' },
                            { value: 'oldest', label: 'Oldest' },
                            { value: 'pnl-high', label: 'Highest PnL' },
                            { value: 'pnl-low', label: 'Lowest PnL' },
                            { value: 'pair-az', label: 'Pair A-Z' }
                        ]}
                    />
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
