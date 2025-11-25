import React, { useState, useEffect, useRef } from 'react';
import { Toast } from './components/Toast';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Controls } from './components/LinkList/Controls';
import { LinkGrid } from './components/LinkList/LinkGrid';
import { BulkActionBar } from './components/LinkList/BulkActionBar';
import { LinkModal } from './components/Modals/LinkModal';
import { HeroSection } from './components/Dashboard/HeroSection';
import { SpeedDial } from './components/Dashboard/SpeedDial';
import { Omnibar } from './components/Dashboard/Omnibar';
import { SmartFeeds } from './components/LinkList/SmartFeeds';
import { useLinks } from './hooks/useLinks';
import { useToast } from './hooks/useToast';
import { LinkItem } from './types';

export default function App() {
    const { toasts, addToast, removeToast } = useToast();
    const {
        links,
        filteredLinks,
        searchQuery,
        setSearchQuery,
        sortMode,
        setSortMode,
        filterMode,
        setFilterMode,
        selectedIds,
        toggleSelection,
        selectAllFiltered,
        clearSelection,
        bulkMode,
        setBulkMode,
        bulkInput,
        setBulkInput,
        performBulkAction,
        performBulkDelete,
        addLink,
        updateLink,
        deleteLink,
        handleRemoveTag,
        handleAddTag,
        toggleFavorite
    } = useLinks(addToast);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
    const omnibarRef = useRef<HTMLInputElement>(null);

    const handleEditLink = (link: LinkItem) => {
        setEditingLink(link);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingLink(null);
    };

    // Global keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd/Ctrl + K: Focus Omnibar
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                // Focus Omnibar input (we'll add ref to Omnibar)
                document.querySelector<HTMLInputElement>('.omnibar-input')?.focus();
            }

            // Escape: Close modal or clear search
            if (e.key === 'Escape') {
                if (isModalOpen) {
                    handleCloseModal();
                } else if (searchQuery) {
                    setSearchQuery('');
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, searchQuery, setSearchQuery]);

    return (
        <div className="min-h-screen dot-matrix-bg text-nothing-dark pb-32 selection:bg-nothing-accent selection:text-white flex flex-col">

            <Header />

            <main className="max-w-7xl mx-auto px-4 md:px-6 pt-10 flex-grow w-full">

                <HeroSection />

                <Omnibar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onAddLink={addLink}
                    addToast={addToast}
                />

                <SpeedDial links={links} />

                <div className="mt-20 mb-8 flex items-center gap-4">
                    <div className="h-px bg-nothing-dark/10 flex-grow"></div>
                    <h2 className="text-sm uppercase tracking-widest text-nothing-dark/50 font-mono">Library</h2>
                    <div className="h-px bg-nothing-dark/10 flex-grow"></div>
                </div>

                <SmartFeeds
                    currentMode={filterMode}
                    onModeChange={setFilterMode}
                />

                <Controls
                    filteredCount={filteredLinks.length}
                    selectedCount={selectedIds.size}
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
                    onEdit={handleEditLink}
                    searchQuery={searchQuery}
                />
            </main>

            <Footer links={links} />

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
                    onBulkDelete={performBulkDelete}
                />
            )}

            <LinkModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUpdate={updateLink}
                linkData={editingLink}
                addToast={addToast}
            />
        </div>
    );
}