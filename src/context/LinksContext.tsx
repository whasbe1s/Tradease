import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { LinkItem } from '../types';
import { useToast } from '../hooks/useToast';
import { logger } from '../lib/logger';
import { UI_CONFIG } from '../lib/constants';

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
    const { addToast } = useToast();
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortMode, setSortMode] = useState<SortMode>('newest');
    const [filterMode, setFilterMode] = useState<FilterMode>('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    // Fetch Links
    const fetchLinks = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            logger.error('Error fetching links:', error);
            addToast('Failed to load links', 'error');
        } else {
            setLinks(data || []);
        }
        setLoading(false);
    }, [addToast]);

    // Initial Load & Real-time Subscription
    useEffect(() => {
        fetchLinks();

        const channel = supabase
            .channel('links_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'links' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setLinks(prev => [payload.new as LinkItem, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    setLinks(prev => prev.map(l => l.id === payload.new.id ? payload.new as LinkItem : l));
                } else if (payload.eventType === 'DELETE') {
                    setLinks(prev => prev.filter(l => l.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchLinks]);

    const addLink = useCallback(async (newLink: LinkItem) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            addToast('You must be logged in to add a link', 'error');
            return;
        }

        const linkWithUser = { ...newLink, user_id: user.id };

        // Optimistic update
        setLinks(prev => [linkWithUser, ...prev]);

        const { error } = await supabase.from('links').insert([linkWithUser]);

        if (error) {
            logger.error('Error adding link:', error);
            addToast('Failed to add link', 'error');
            // Revert optimistic update
            fetchLinks();
        } else {
            addToast("Link established.", 'success');
        }
    }, [addToast, fetchLinks]);

    const updateLink = useCallback(async (id: string, updates: Partial<LinkItem>) => {
        // Optimistic update
        setLinks(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));

        const { error } = await supabase.from('links').update(updates).eq('id', id);

        if (error) {
            logger.error('Error updating link:', error);
            addToast('Failed to update link', 'error');
            fetchLinks();
        } else {
            addToast("Link updated.", 'success');
        }
    }, [addToast, fetchLinks]);

    const deleteLink = useCallback(async (id: string) => {
        const linkToDelete = links.find(l => l.id === id);
        if (!linkToDelete) return;

        // Optimistic update
        setLinks(prev => prev.filter(l => l.id !== id));
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });

        const { error } = await supabase.from('links').delete().eq('id', id);

        if (error) {
            logger.error('Error deleting link:', error);
            addToast('Failed to delete link', 'error');
            fetchLinks();
        } else {
            // Add toast with undo
            addToast("Entry deleted.", 'info', async () => {
                // Undo: restore the link
                const { error: undoError } = await supabase.from('links').insert([linkToDelete]);
                if (undoError) {
                    addToast('Failed to undo delete', 'error');
                }
            });
        }
    }, [links, addToast, fetchLinks]);

    const handleRemoveTag = useCallback(async (id: string, tag: string) => {
        const link = links.find(l => l.id === id);
        if (!link) return;

        const newTags = link.tags.filter(t => t !== tag);
        updateLink(id, { tags: newTags });
        addToast(`Tag #${tag} removed.`, 'info');
    }, [links, updateLink, addToast]);

    const handleAddTag = useCallback((id: string, tag: string) => {
        const link = links.find(l => l.id === id);
        if (!link) return;
        if (!link.tags.includes(tag)) {
            updateLink(id, { tags: [...link.tags, tag] });
            addToast(`Tag #${tag} added.`, 'success');
        }
    }, [links, updateLink, addToast]);

    const toggleFavorite = useCallback((id: string) => {
        const link = links.find(l => l.id === id);
        if (!link) return;
        updateLink(id, { favorite: !link.favorite });
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

    const selectAllFiltered = useCallback(() => {
        const ids = filteredLinks.map(l => l.id);
        setSelectedIds(new Set(ids));
    }, [filteredLinks]);

    const clearSelection = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    const performBulkDelete = useCallback(async () => {
        if (window.confirm(`Delete ${selectedIds.size} items?`)) {
            const ids = Array.from(selectedIds);

            // Optimistic
            setLinks(prev => prev.filter(l => !selectedIds.has(l.id)));
            setSelectedIds(new Set());

            const { error } = await supabase.from('links').delete().in('id', ids);

            if (error) {
                logger.error('Error bulk deleting:', error);
                addToast('Failed to delete items', 'error');
                fetchLinks();
            } else {
                addToast(`Deleted ${ids.length} items.`, 'info');
            }
        }
    }, [selectedIds, addToast, fetchLinks]);

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
            selectAllFiltered,
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
