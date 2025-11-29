import React from 'react';
import { BookOpen } from 'lucide-react';
import { JournalToolbar } from './JournalToolbar';
import { TradeList } from './TradeList';
import { BulkActionBar } from '../LinkList/BulkActionBar';
import { useLinksContext } from '../../context/LinksContext';
import { LinkItem } from '../../types';

interface JournalSectionProps {
    onEdit: (link: LinkItem) => void;
}

export const JournalSection: React.FC<JournalSectionProps> = ({ onEdit }) => {
    const {
        filteredLinks,
        sortMode,
        setSortMode,
        filterMode,
        setFilterMode,
        selectedIds,
        toggleSelection,
        selectAllFiltered,
        clearSelection,
        performBulkDelete,
        deleteLink,
        toggleFavorite,
        searchQuery,
        setSearchQuery
    } = useLinksContext();

    return (
        <>
            <div
                className="w-full h-full backdrop-blur-md border border-nothing-dark/10 rounded-3xl p-6 shadow-xl overflow-hidden flex flex-col bg-glass relative group"
            >
                {/* Unified Toolbar */}
                <JournalToolbar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filterMode={filterMode}
                    setFilterMode={setFilterMode}
                    sortMode={sortMode}
                    setSortMode={setSortMode}
                    filteredCount={filteredLinks.length}
                />

                {/* Trade List Content */}
                <div className="flex-1 overflow-hidden mt-4 relative z-10">
                    {filteredLinks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8 text-nothing-dark/40">
                            <div className="w-12 h-12 rounded-full bg-nothing-dark/5 flex items-center justify-center mb-3">
                                <BookOpen size={20} className="opacity-50" />
                            </div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-nothing-dark/40 mb-2">
                                {searchQuery ? 'NO_MATCHES_FOUND' : 'JOURNAL_EMPTY'}
                            </p>
                            <p className="text-xs text-nothing-dark/30 font-mono max-w-[200px]">
                                {searchQuery ? 'Try adjusting your search or filters.' : 'Start logging your trades to build your edge.'}
                            </p>
                        </div>
                    ) : (
                        <div className="h-full overflow-y-auto custom-scrollbar pr-2">
                            <TradeList
                                links={filteredLinks}
                                selectedIds={selectedIds}
                                onToggleSelection={toggleSelection}
                                onSelectAll={selectAllFiltered}
                                onDelete={deleteLink}
                                onEdit={onEdit}
                                onToggleFavorite={toggleFavorite}
                                sortMode={sortMode}
                                setSortMode={setSortMode}
                            />
                        </div>
                    )}
                </div>

                {/* Background Decoration - Dot Matrix */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#435663 1px, transparent 1px)',
                        backgroundSize: '12px 12px'
                    }}
                ></div>
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.size > 0 && (
                <BulkActionBar
                    selectedCount={selectedIds.size}
                    onClearSelection={clearSelection}
                    onBulkDelete={performBulkDelete}
                />
            )}
        </>
    );
};
