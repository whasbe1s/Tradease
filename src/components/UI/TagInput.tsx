import React, { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from './Badge';

interface TagInputProps {
    tags: string[];
    onAddTag: (tag: string) => void;
    onRemoveTag: (tag: string) => void;
    placeholder?: string;
    maxTags?: number;
}

export const TagInput: React.FC<TagInputProps> = ({
    tags,
    onAddTag,
    onRemoveTag,
    placeholder = 'Add tag...',
    maxTags = 10
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            onRemoveTag(tags[tags.length - 1]);
        }
    };

    const addTag = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !tags.includes(trimmed) && tags.length < maxTags) {
            onAddTag(trimmed);
            setInputValue('');
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                    <Badge key={tag} variant="soft" color="neutral" className="pl-2 pr-1 py-1 gap-1">
                        {tag}
                        <button
                            type="button"
                            onClick={() => onRemoveTag(tag)}
                            className="hover:bg-nothing-dark/20 rounded-full p-0.5 transition-colors"
                        >
                            <X size={10} />
                        </button>
                    </Badge>
                ))}
            </div>
            <div className="relative group">
                <input
                    id="tag-input"
                    name="tag-input"
                    type="text"
                    autoComplete="off"
                    data-lpignore="true"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag}
                    placeholder={tags.length < maxTags ? placeholder : `Max ${maxTags} tags`}
                    disabled={tags.length >= maxTags}
                    className="w-full bg-nothing-dark/5 border border-transparent rounded-xl px-4 py-3 font-mono text-sm focus:bg-white focus:text-nothing-base focus:border-nothing-dark/10 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-nothing-dark/30">
                    <Plus size={16} />
                </div>
            </div>
        </div>
    );
};
