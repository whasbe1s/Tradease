import React, { useState, useEffect } from 'react';
import { X, Edit2 } from 'lucide-react';
import { Button } from '../Button';
import { LinkItem } from '../../types';

interface LinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<LinkItem>) => void;
    linkData: LinkItem | null;
}

export const LinkModal: React.FC<LinkModalProps> = ({ isOpen, onClose, onUpdate, linkData }) => {
    const [urlInput, setUrlInput] = useState('');
    const [titleInput, setTitleInput] = useState('');
    const [descriptionInput, setDescriptionInput] = useState('');
    const [tagsInput, setTagsInput] = useState('');

    useEffect(() => {
        if (isOpen && linkData) {
            setUrlInput(linkData.url);
            setTitleInput(linkData.title);
            setDescriptionInput(linkData.description);
            setTagsInput(linkData.tags.join(', '));
        }
    }, [isOpen, linkData]);

    if (!isOpen || !linkData) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const manualTags = tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);

        onUpdate(linkData.id, {
            url: urlInput,
            title: titleInput,
            description: descriptionInput,
            tags: manualTags
        });
        onClose();
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
                    <Edit2 className="text-nothing-accent" size={24} />
                    Edit Entry
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
                        <label className="block font-mono text-xs uppercase tracking-widest mb-2 text-nothing-dim">Title</label>
                        <input
                            type="text"
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            className="w-full bg-nothing-surface border border-nothing-dark p-3 font-mono text-sm focus:outline-none focus:border-nothing-accent focus:ring-1 focus:ring-nothing-accent transition-all rounded-none placeholder:text-nothing-dark/30"
                            placeholder="Link Title"
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest mb-2 text-nothing-dim">Description</label>
                        <textarea
                            value={descriptionInput}
                            onChange={(e) => setDescriptionInput(e.target.value)}
                            className="w-full bg-nothing-surface border border-nothing-dark p-3 font-mono text-sm focus:outline-none focus:border-nothing-accent focus:ring-1 focus:ring-nothing-accent transition-all rounded-none placeholder:text-nothing-dark/30 h-24 resize-none"
                            placeholder="Description..."
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest mb-2 text-nothing-dim">Tags</label>
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
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
