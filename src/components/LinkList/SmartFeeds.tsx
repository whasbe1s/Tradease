import React from 'react';
import { Layers, TrendingUp, TrendingDown, Star } from 'lucide-react';

interface SmartFeedsProps {
    currentMode: 'all' | 'win' | 'loss' | 'favorites';
    onModeChange: (mode: 'all' | 'win' | 'loss' | 'favorites') => void;
}

export const SmartFeeds: React.FC<SmartFeedsProps> = ({ currentMode, onModeChange }) => {
    const feeds = [
        { id: 'all', label: 'All Trades', icon: Layers },
        { id: 'win', label: 'Wins', icon: TrendingUp },
        { id: 'loss', label: 'Losses', icon: TrendingDown },
        { id: 'favorites', label: 'Best Setups', icon: Star },
    ] as const;

    return (
        <div className="flex items-center justify-center">
            <div className="flex items-center bg-nothing-surface/20 backdrop-blur-md p-1 rounded-xl border border-nothing-dark/5 shadow-sm">
                {feeds.map((feed) => {
                    const isActive = currentMode === feed.id;
                    const Icon = feed.icon;
                    return (
                        <button
                            key={feed.id}
                            onClick={() => onModeChange(feed.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase transition-all rounded-lg
                                ${isActive
                                    ? 'bg-nothing-surface text-nothing-dark shadow-sm font-bold'
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
