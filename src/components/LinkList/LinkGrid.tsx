import React from 'react';
import { LinkItem } from '../../types';
import { LinkCard } from '../LinkCard';

interface LinkGridProps {
    links: LinkItem[];
    selectedIds: Set<string>;
    onToggleSelection: (id: string) => void;
    onDelete: (id: string) => void;
    onRemoveTag: (id: string, tag: string) => void;
    onAddTag: (id: string, tag: string) => void;
    onTagClick: (tag: string) => void;
    onToggleFavorite: (id: string) => void;
    onEdit: (link: LinkItem) => void;
    searchQuery: string;
}

export const LinkGrid: React.FC<LinkGridProps> = ({
    links,
    selectedIds,
    onToggleSelection,
    onDelete,
    onRemoveTag,
    onAddTag,
    onTagClick,
    onToggleFavorite,
    onEdit,
    searchQuery
}) => {
    if (links.length === 0) {
        return (
            <div className="text-center py-32 border-2 border-dashed border-nothing-dark/10 animate-in fade-in duration-500 rounded-none">
                <p className="font-mono text-nothing-dark/40 uppercase tracking-widest mb-2">
                    {searchQuery ? 'NO MATCHES FOUND' : 'ARCHIVE EMPTY'}
                </p>
                {!searchQuery && (
                    <p className="text-sm text-nothing-dark/30 font-sans mt-4">
                        Start by pasting a URL in the search bar above
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {links.map(link => (
                <LinkCard
                    key={link.id}
                    link={link}
                    selected={selectedIds.has(link.id)}
                    onToggleSelect={() => onToggleSelection(link.id)}
                    onDelete={onDelete}
                    onRemoveTag={onRemoveTag}
                    onAddTag={onAddTag}
                    onTagClick={onTagClick}
                    onToggleFavorite={() => onToggleFavorite(link.id)}
                    onEdit={() => onEdit(link)}
                />
            ))}
        </div>
    );
};
