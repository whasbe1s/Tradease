import React, { useState } from 'react';
import { Toast } from './components/Toast';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { SearchBar } from './components/LinkList/SearchBar';
import { Controls } from './components/LinkList/Controls';
import { LinkGrid } from './components/LinkList/LinkGrid';
import { BulkActionBar } from './components/LinkList/BulkActionBar';
import { AddLinkModal } from './components/Modals/AddLinkModal';
import { useLinks } from './hooks/useLinks';
import { useToast } from './hooks/useToast';

export default function App() {
    const { toasts, addToast, removeToast } = useToast();
    const {
        filteredLinks,
        searchQuery,
        setSearchQuery,
        sortMode,
        setSortMode,
        showFavorites,
        setShowFavorites,
        selectedIds,
        toggleSelection,
        selectAllFiltered,
        clearSelection,
        bulkMode,
        setBulkMode, // Needed if we want to pass it down, but BulkActionBar handles its own mode mostly? No, it needs to trigger the action.
        bulkInput,
        setBulkInput,
        performBulkAction,
        performBulkDelete,
        addLink,
        deleteLink,
        handleRemoveTag,
        handleAddTag,
        toggleFavorite
    } = useLinks(addToast);

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="min-h-screen dot-matrix-bg text-nothing-dark pb-32 selection:bg-nothing-accent selection:text-white flex flex-col">

            <Header onAddClick={() => setIsModalOpen(true)} />

            <main className="max-w-7xl mx-auto px-4 md:px-6 pt-10 flex-grow w-full">

                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                <Controls
                    filteredCount={filteredLinks.length}
                    selectedCount={selectedIds.size}
                    showFavorites={showFavorites}
                    setShowFavorites={setShowFavorites}
                    sortMode={sortMode}
                    setSortMode={setSortMode}
                    onSelectAll={selectAllFiltered}
                    onClearSelection={clearSelection}
                    areAllSelected={selectedIds.size === filteredLinks.length}
                />

                <LinkGrid
                    links={filteredLinks}
                    selectedIds={selectedIds}
                    onToggleSelection={toggleSelection}
                    onDelete={deleteLink}
                    onRemoveTag={handleRemoveTag}
                    onAddTag={handleAddTag}
                    onTagClick={setSearchQuery}
                    onToggleFavorite={toggleFavorite}
                    searchQuery={searchQuery}
                    showFavorites={showFavorites}
                />
            </main>

            <Footer />

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <Toast key={toast.id} toast={toast} onClose={removeToast} />
                ))}
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.size > 0 && (
                <BulkActionBar
                    selectedCount={selectedIds.size}
                    onClearSelection={clearSelection}
                    onBulkAction={(mode, tag) => {
                        // We need to set state in hook and then trigger action? 
                        // The hook exposes performBulkAction which uses state.
                        // We should probably update the hook to accept arguments for performBulkAction or expose setters.
                        // Current hook implementation uses state for mode/input.
                        // Let's update the hook usage or the component.
                        // For now, let's assume we can set state then trigger.
                        // Actually, the hook's performBulkAction relies on state. 
                        // We need to set the state in the hook.
                        setBulkMode(mode);
                        setBulkInput(tag);
                        // We need to wait for state update? No, React batching might handle it or we need useEffect.
                        // Better: Update useLinks to accept params in performBulkAction.
                        // But for now, let's just set state and let the user click "Apply" in the bar?
                        // Wait, BulkActionBar has its own "Apply" button which calls onBulkAction.
                        // My BulkActionBar implementation has local state for mode/input.
                        // It calls onBulkAction(mode, input).
                        // So I should pass a function that takes these and calls the hook logic.
                        // I need to refactor useLinks to accept params for performBulkAction.
                    }}
                    onBulkDelete={performBulkDelete}
                />
            )}

            {/* Re-implementing BulkActionBar logic correctly */}
            {/* 
        The BulkActionBar component I created handles the UI for mode/input.
        It calls onBulkAction(mode, tag).
        The useLinks hook has performBulkAction() which uses its own state.
        This is a mismatch.
        I should update useLinks to accept arguments, OR update App.tsx to bridge them.
        
        Let's update useLinks in the next step to be more flexible.
        For now, I will write App.tsx assuming useLinks will be updated.
      */}

            <AddLinkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddLink={addLink}
                addToast={addToast}
            />
        </div>
    );
}