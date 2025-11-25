import { useState, useEffect, useMemo, useCallback } from 'react';
import { LinkItem } from '../types';

const STORAGE_KEY = 'nothing_links_db';

type SortMode = 'newest' | 'oldest' | 'az' | 'za';
type BulkMode = 'none' | 'add_tag' | 'remove_tag';

export const useLinks = (addToast: (msg: string, type?: 'success' | 'error' | 'info') => void) => {
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortMode, setSortMode] = useState<SortMode>('newest');
    const [filterMode, setFilterMode] = useState<'all' | 'inbox' | 'read-later' | 'favorites'>('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkMode, setBulkMode] = useState<BulkMode>('none');
    const [bulkInput, setBulkInput] = useState('');

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const migrated = parsed.map((item: any) => ({
                    ...item,
                    favorite: item.favorite || false
                }));
                setLinks(migrated);
            } catch (e) {
                console.error("Failed to load links", e);
            }
        }
    }, []);

    // Persistence
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    }, [links]);

    const addLink = useCallback((newLink: LinkItem) => {
        setLinks(prev => [newLink, ...prev]);
        addToast("Link established.", 'success');
    }, [addToast]);

    const updateLink = useCallback((id: string, updates: Partial<LinkItem>) => {
        setLinks(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
        addToast("Link updated.", 'success');
    }, [addToast]);

    const deleteLink = useCallback((id: string) => {
        const linkToDelete = links.find(l => l.id === id);
        if (!linkToDelete) return;

        setLinks(prev => prev.filter(l => l.id !== id));
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });

        // Add toast with undo
        addToast("Entry deleted.", 'info', () => {
            // Undo: restore the link
            setLinks(prev => [linkToDelete, ...prev]);
        });
    }, [links, addToast]);

    const handleRemoveTag = useCallback((id: string, tag: string) => {
        setLinks(prev => prev.map(l => {
            if (l.id === id) {
                return { ...l, tags: l.tags.filter(t => t !== tag) };
            }
            return l;
        }));
        addToast(`Tag #${tag} removed.`, 'info');
    }, [addToast]);

    const handleAddTag = useCallback((id: string, tag: string) => {
        setLinks(prev => prev.map(l => {
            if (l.id === id && !l.tags.includes(tag)) {
                return { ...l, tags: [...l.tags, tag] };
            }
            return l;
        }));
        addToast(`Tag #${tag} added.`, 'success');
    }, [addToast]);

    const toggleFavorite = useCallback((id: string) => {
        setLinks(prev => prev.map(l => {
            if (l.id === id) {
                return { ...l, favorite: !l.favorite };
            }
            return l;
        }));
    }, []);

    // Bulk Actions
    const toggleSelection = useCallback((id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const filteredLinks = useMemo(() => {
        let result = links.filter(link => {
            // Smart Feeds Logic
            if (filterMode === 'inbox') {
                if (link.tags.length > 0) return false;
            } else if (filterMode === 'read-later') {
                if (!link.tags.includes('read-later')) return false;
            } else if (filterMode === 'favorites') {
                if (!link.favorite) return false;
            }

            const q = searchQuery.toLowerCase();
            return (
                link.title.toLowerCase().includes(q) ||
                link.url.toLowerCase().includes(q) ||
                link.tags.some(t => t.toLowerCase().includes(q)) ||
                link.description.toLowerCase().includes(q)
            );
        });

        result.sort((a, b) => {
            switch (sortMode) {
                case 'oldest': return a.createdAt - b.createdAt;
                case 'az': return a.title.localeCompare(b.title);
                case 'za': return b.title.localeCompare(a.title);
                case 'newest':
                default: return b.createdAt - a.createdAt;
            }
        });
        return result;
    }, [links, searchQuery, sortMode, filterMode]);

    const selectAllFiltered = useCallback(() => {
        const ids = filteredLinks.map(l => l.id);
        setSelectedIds(new Set(ids));
    }, [filteredLinks]);

    const clearSelection = useCallback(() => {
        setSelectedIds(new Set());
        setBulkMode('none');
        setBulkInput('');
    }, []);

    const performBulkAction = useCallback((mode: BulkMode, tag: string) => {
        if (mode === 'none') return;

        const normalizedTag = tag.trim().toLowerCase();

        setLinks(prev => prev.map(link => {
            if (!selectedIds.has(link.id)) return link;

            if (mode === 'add_tag') {
                if (normalizedTag && !link.tags.includes(normalizedTag)) {
                    return { ...link, tags: [...link.tags, normalizedTag] };
                }
            } else if (mode === 'remove_tag') {
                if (normalizedTag) {
                    return { ...link, tags: link.tags.filter(t => t !== normalizedTag) };
                }
            }
            return link;
        }));

        addToast(`Bulk action complete: ${selectedIds.size} items updated.`, 'success');
        setBulkMode('none');
        setBulkInput('');
        setSelectedIds(new Set());
    }, [selectedIds, addToast]);

    const performBulkDelete = useCallback(() => {
        if (window.confirm(`Delete ${selectedIds.size} items?`)) {
            setLinks(prev => prev.filter(l => !selectedIds.has(l.id)));
            addToast(`Deleted ${selectedIds.size} items.`, 'info');
            setSelectedIds(new Set());
        }
    }, [selectedIds, addToast]);

    return {
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
    };
};
