import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode, useEffect } from 'react';
import { LinkItem } from '../types';
import { UI_CONFIG } from '../lib/constants';
import { useLinksQuery, useAddLinkMutation, useUpdateLinkMutation, useDeleteLinkMutation } from '../hooks/useLinks';

type SortMode = 'newest' | 'oldest' | 'pnl-high' | 'pnl-low' | 'pair-az';
type FilterMode = 'all' | 'win' | 'loss' | 'favorites';

interface LinksContextType {
    links: LinkItem[];
    filteredLinks: LinkItem[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortMode: SortMode;
    setSortMode: (mode: SortMode) => void;
    filterMode: FilterMode;
    setFilterMode: (mode: FilterMode) => void;
    selectedIds: Set<string>;
    toggleSelection: (id: string) => void;
    selectAllFiltered: () => void;
    clearSelection: () => void;
    performBulkDelete: () => Promise<void>;
    addLink: (newLink: LinkItem) => Promise<void>;
    updateLink: (id: string, updates: Partial<LinkItem>) => Promise<void>;
    deleteLink: (id: string) => Promise<void>;
    handleRemoveTag: (id: string, tag: string) => Promise<void>;
    handleAddTag: (id: string, tag: string) => void;
    toggleFavorite: (id: string) => void;
    loading: boolean;
}

const LinksContext = createContext<LinksContextType | undefined>(undefined);

export const LinksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // React Query Hooks
    const { data: links = [], isLoading: loading } = useLinksQuery();
    const addLinkMutation = useAddLinkMutation();
    const updateLinkMutation = useUpdateLinkMutation();
    const deleteLinkMutation = useDeleteLinkMutation();

    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [sortMode, setSortMode] = useState<SortMode>('newest');
    const [filterMode, setFilterMode] = useState<FilterMode>('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Actions Wrappers
    const addLink = useCallback(async (newLink: LinkItem) => {
        await addLinkMutation.mutateAsync(newLink);
    }, [addLinkMutation]);

    const updateLink = useCallback(async (id: string, updates: Partial<LinkItem>) => {
        await updateLinkMutation.mutateAsync({ id, updates });
    }, [updateLinkMutation]);

    const deleteLink = useCallback(async (id: string) => {
        await deleteLinkMutation.mutateAsync(id);
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }, [deleteLinkMutation]);

    const handleRemoveTag = useCallback(async (id: string, tag: string) => {
        const link = links.find(l => l.id === id);
        if (!link) return;
        const newTags = link.tags.filter(t => t !== tag);
        await updateLink(id, { tags: newTags });
    }, [links, updateLink]);

    const handleAddTag = useCallback(async (id: string, tag: string) => {
        const link = links.find(l => l.id === id);
        if (!link) return;
        if (!link.tags.includes(tag)) {
            await updateLink(id, { tags: [...link.tags, tag] });
        }
    }, [links, updateLink]);

    const toggleFavorite = useCallback(async (id: string) => {
        const link = links.find(l => l.id === id);
        if (!link) return;
        await updateLink(id, { favorite: !link.favorite });
    }, [links, updateLink]);

    // Bulk Actions
    const toggleSelection = useCallback((id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const performBulkDelete = useCallback(async () => {
        if (window.confirm(`Delete ${selectedIds.size} items?`)) {
            const ids = Array.from(selectedIds);
            // Execute in parallel
            await Promise.all(ids.map(id => deleteLinkMutation.mutateAsync(id)));
            setSelectedIds(new Set());
        }
    }, [selectedIds, deleteLinkMutation]);

    const selectAllFiltered = useCallback(() => {
        // We need filteredLinks here, but it's defined below.
        // We can use a ref or move filteredLinks up, but useMemo depends on state.
        // Let's just use the logic inside or move filteredLinks definition up if possible.
        // Actually, we can't easily access filteredLinks inside this callback if it's defined after.
        // But we can just use the same logic or pass it.
        // However, standard React pattern is to define derived state first if needed.
        // Let's define filteredLinks first.
    }, []);

    // Debounced Search Query
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, UI_CONFIG.DEBOUNCE_DELAY);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const filteredLinks = useMemo(() => {
        // First filter by mode
        let result = links.filter(link => {
            switch (filterMode) {
                case 'win': return link.outcome === 'win';
                case 'loss': return link.outcome === 'loss';
                case 'favorites': return link.favorite;
                default: return true;
            }
        });

        // Then filter by search query if present
        if (debouncedSearchQuery) {
            const q = debouncedSearchQuery.toLowerCase();
            result = result.filter(link =>
                link.title.toLowerCase().includes(q) ||
                link.url.toLowerCase().includes(q) ||
                link.tags.some(t => t.toLowerCase().includes(q)) ||
                link.description.toLowerCase().includes(q) ||
                (link.pair && link.pair.toLowerCase().includes(q)) ||
                (link.notes && link.notes.toLowerCase().includes(q))
            );
        }

        // Finally sort
        result.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();

            switch (sortMode) {
                case 'oldest': return dateA - dateB;
                case 'pnl-high': return (b.pnl || 0) - (a.pnl || 0);
                case 'pnl-low': return (a.pnl || 0) - (b.pnl || 0);
                case 'pair-az': return (a.pair || a.title || '').localeCompare(b.pair || b.title || '');
                case 'newest':
                default: return dateB - dateA;
            }
        });
        return result;
    }, [links, debouncedSearchQuery, sortMode, filterMode]);

    // Redefine selectAllFiltered now that filteredLinks is available?
    // No, useMemo runs during render. useCallback creates function.
    // If we want to use filteredLinks in selectAllFiltered, we need to include it in dependency array.

    const selectAllFilteredAction = useCallback(() => {
        const ids = filteredLinks.map(l => l.id);
        setSelectedIds(new Set(ids));
    }, [filteredLinks]);

    const clearSelection = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    return (
        <LinksContext.Provider value={{
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
            selectAllFiltered: selectAllFilteredAction,
            clearSelection,
            performBulkDelete,
            addLink,
            updateLink,
            deleteLink,
            handleRemoveTag,
            handleAddTag,
            toggleFavorite,
            loading
        }}>
            {children}
        </LinksContext.Provider>
    );
};

export const useLinksContext = () => {
    const context = useContext(LinksContext);
    if (context === undefined) {
        throw new Error('useLinksContext must be used within a LinksProvider');
    }
    return context;
};
