import React from 'react';
import { LinkItem } from '../../types';
import { ExternalLink } from 'lucide-react';

interface SpeedDialProps {
    links: LinkItem[];
}

export const SpeedDial: React.FC<SpeedDialProps> = ({ links }) => {
    const favorites = links.filter(link => link.favorite).slice(0, 8);

    if (favorites.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mx-auto mt-12 px-4 animate-fade-in-up">
            <h3 className="text-sm uppercase tracking-widest text-nothing-dark/50 font-mono mb-4">Speed Dial</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {favorites.map(link => (
                    <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col p-4 rounded-xl bg-white/50 border border-nothing-dark/10 hover:border-nothing-dark/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-8 h-8 rounded-full bg-nothing-dark/5 flex items-center justify-center text-nothing-dark/50 group-hover:bg-nothing-accent group-hover:text-white transition-colors">
                                <ExternalLink size={14} />
                            </div>
                        </div>
                        <span className="font-medium text-nothing-dark truncate">{link.title}</span>
                        <span className="text-xs text-nothing-dark/50 truncate mt-1">{new URL(link.url).hostname}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};
