import React, { useState } from 'react';
import { X, Zap } from 'lucide-react';
import { Button } from '../Button';
import { enrichLinkData } from '../../services/geminiService';
import { LinkItem } from '../../types';

interface AddLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddLink: (link: LinkItem) => void;
    addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, onAddLink, addToast }) => {
    const [urlInput, setUrlInput] = useState('');
    const [titleInput, setTitleInput] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [isEnriching, setIsEnriching] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!urlInput) return;

        setIsEnriching(true);

        try {
            const enriched = await enrichLinkData(urlInput, titleInput);

            const manualTags = tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
            const aiTags = enriched.tags.map(t => t.toLowerCase());
            const finalTags = Array.from(new Set([...manualTags, ...aiTags]));

            const newLink: LinkItem = {
                id: crypto.randomUUID(),
                url: urlInput,
                title: enriched.title,
                description: enriched.description,
                tags: finalTags,
                createdAt: Date.now(),
                favorite: false,
            };

            onAddLink(newLink);

            // Reset & Close
            setUrlInput('');
            setTitleInput('');
            setTagsInput('');
            onClose();
        } catch (e) {
            addToast("Failed to process link.", 'error');
        } finally {
            setIsEnriching(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-nothing-base/90 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-nothing-base border-2 border-nothing-dark shadow-[8px_8px_0px_0px_rgba(34,34,34,1)] p-8 animate-in fade-in zoom-in duration-200 rounded-none">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-nothing-dark/50 hover:text-nothing-accent transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold font-mono mb-8 uppercase flex items-center gap-2">
                    <Zap className="text-nothing-accent" size={24} fill="currentColor" />
                    New Entry
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest mb-2 text-nothing-dim">Target URL</label>
                        <input
                            required
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            className="w-full bg-nothing-surface border border-nothing-dark p-3 font-mono text-sm focus:outline-none focus:border-nothing-accent focus:ring-1 focus:ring-nothing-accent transition-all rounded-none placeholder:text-nothing-dark/30"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest mb-2 text-nothing-dim">Title (Optional)</label>
                        <input
                            type="text"
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            className="w-full bg-nothing-surface border border-nothing-dark p-3 font-mono text-sm focus:outline-none focus:border-nothing-accent focus:ring-1 focus:ring-nothing-accent transition-all rounded-none placeholder:text-nothing-dark/30"
                            placeholder="Leave empty for AI auto-detect"
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest mb-2 text-nothing-dim">Tags (Optional)</label>
                        <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            className="w-full bg-nothing-surface border border-nothing-dark p-3 font-mono text-sm focus:outline-none focus:border-nothing-accent focus:ring-1 focus:ring-nothing-accent transition-all rounded-none placeholder:text-nothing-dark/30"
                            placeholder="tech, design, news (comma separated)"
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="font-mono text-xs uppercase hover:underline underline-offset-4"
                        >
                            Cancel
                        </button>
                        <Button type="submit" isLoading={isEnriching}>
                            {isEnriching ? 'Processing...' : 'Confirm'}
                        </Button>
                    </div>
                </form>

                {isEnriching && (
                    <div className="absolute bottom-2 left-8 right-8 text-center">
                        <p className="text-[10px] font-mono text-nothing-dim animate-pulse">
                            MODELS.GENERATE_CONTENT :: GEMINI-2.5-FLASH
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
