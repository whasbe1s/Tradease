import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { LinkItem } from '../types';
import { useToast } from './useToast';

export const useLinksQuery = () => {
    const { addToast } = useToast();
    return useQuery({
        queryKey: ['links'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('links')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                addToast('Failed to load links', 'error');
                throw error;
            }
            return data as LinkItem[];
        },
    });
};

export const useAddLinkMutation = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    return useMutation({
        mutationFn: async (newLink: LinkItem) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not logged in');

            const linkWithUser = { ...newLink, user_id: user.id };
            const { error } = await supabase.from('links').insert([linkWithUser]);
            if (error) throw error;
            return linkWithUser;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['links'] });
            addToast("Link established.", 'success');
        },
        onError: (error) => {
            console.error('Error adding link:', error);
            addToast('Failed to add link', 'error');
        }
    });
};

export const useUpdateLinkMutation = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<LinkItem> }) => {
            const { error } = await supabase.from('links').update(updates).eq('id', id);
            if (error) throw error;
            return { id, updates };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['links'] });
            addToast("Link updated.", 'success');
        },
        onError: (error) => {
            console.error('Error updating link:', error);
            addToast('Failed to update link', 'error');
        }
    });
};

export const useDeleteLinkMutation = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('links').delete().eq('id', id);
            if (error) throw error;
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['links'] });
            // Toast handling is done in the context usually to allow undo, 
            // but we can keep it simple here for now or let context handle the toast.
            // The context was doing a complex undo logic. 
            // For now, let's just invalidate.
        },
        onError: (error) => {
            console.error('Error deleting link:', error);
            addToast('Failed to delete link', 'error');
        }
    });
};
