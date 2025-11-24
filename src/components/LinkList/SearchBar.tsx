import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="relative mb-8 max-w-2xl flex items-end gap-4">
            <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-nothing-dark/40 group-focus-within:text-nothing-accent transition-colors">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder="SEARCH URL, TAGS, TITLE..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-nothing-dark/20 py-4 pl-12 pr-4 text-xl font-mono focus:outline-none focus:border-nothing-accent transition-all placeholder:text-nothing-dark/30 rounded-none"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-12 top-1/2 -translate-y-1/2 text-nothing-dark/40 hover:text-nothing-accent"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};
