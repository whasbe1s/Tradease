import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { LinkItem } from '../types';

type SortMode = 'newest' | 'oldest' | 'az' | 'za';
type BulkMode = 'none' | 'add_tag' | 'remove_tag';

export const useLinks = (addToast: (msg: string, type?: 'success' | 'error' | 'info', onUndo?: () => void) => void) => {
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortMode, setSortMode] = useState<SortMode>('newest');
    const [filterMode, setFilterMode] = useState<'all' | 'inbox' | 'read-later' | 'favorites'>('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkMode, setBulkMode] = useState<BulkMode>('none');
    const [bulkInput, setBulkInput] = useState('');

    // Fetch Links
    const fetchLinks = useCallback(async () => {
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching links:', error);
            addToast('Failed to load links', 'error');
        } else {
            setLinks(data || []);
        }
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
        // Optimistic update
        setLinks(prev => [newLink, ...prev]);

        // We don't need to send ID as Supabase generates it, but if we generate it client-side (UUID) we can send it.
        // The schema says ID DEFAULT gen_random_uuid(), so we can omit it OR send it if we generated a valid UUID.
        // Let's assume newLink has a temporary ID or a valid UUID. 
        // Ideally we should let Supabase generate ID, but our UI needs one immediately.
        // If we generated a UUID, we can send it.

        const { error } = await supabase.from('links').insert([newLink]);

        if (error) {
            console.error('Error adding link:', error);
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
            console.error('Error updating link:', error);
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
            console.error('Error deleting link:', error);
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
        // Not used in UI anymore but kept for compatibility
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
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();

            switch (sortMode) {
                case 'oldest': return dateA - dateB;
                case 'az': return a.title.localeCompare(b.title);
                case 'za': return b.title.localeCompare(a.title);
                case 'newest':
                default: return dateB - dateA;
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
        // Not used in UI anymore
    }, []);

    const performBulkDelete = useCallback(async () => {
        if (window.confirm(`Delete ${selectedIds.size} items?`)) {
            const ids = Array.from(selectedIds);

            // Optimistic
            setLinks(prev => prev.filter(l => !selectedIds.has(l.id)));
            setSelectedIds(new Set());

            const { error } = await supabase.from('links').delete().in('id', ids);

            if (error) {
                console.error('Error bulk deleting:', error);
                addToast('Failed to delete items', 'error');
                fetchLinks();
            } else {
                addToast(`Deleted ${ids.length} items.`, 'info');
            }
        }
    }, [selectedIds, addToast, fetchLinks]);

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
