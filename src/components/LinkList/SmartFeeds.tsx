import React from 'react';
import { Inbox, BookMarked, Star, Layers } from 'lucide-react';

interface SmartFeedsProps {
    currentMode: 'all' | 'inbox' | 'read-later' | 'favorites';
    onModeChange: (mode: 'all' | 'inbox' | 'read-later' | 'favorites') => void;
}

export const SmartFeeds: React.FC<SmartFeedsProps> = ({ currentMode, onModeChange }) => {
    const feeds = [
        { id: 'all', label: 'All', icon: Layers },
        { id: 'inbox', label: 'Inbox', icon: Inbox },
        { id: 'read-later', label: 'Read Later', icon: BookMarked },
        { id: 'favorites', label: 'Favorites', icon: Star },
    ] as const;

    return (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center bg-nothing-surface/50 p-1 rounded-none border border-nothing-dark/10">
                {feeds.map((feed) => {
                    const isActive = currentMode === feed.id;
                    const Icon = feed.icon;
                    return (
                        <button
                            key={feed.id}
                            onClick={() => onModeChange(feed.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase transition-all rounded-none
                                ${isActive
                                    ? 'bg-nothing-surface text-nothing-dark shadow-sm'
                                    : 'text-nothing-dark/50 hover:text-nothing-dark hover:bg-nothing-dark/5'
                                }
                            `}
                        >
                            <Icon size={14} className={isActive ? 'text-nothing-accent' : ''} />
                            {feed.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
