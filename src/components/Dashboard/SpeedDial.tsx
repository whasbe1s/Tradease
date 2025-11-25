import React, { useEffect } from 'react';
import { LinkItem } from '../../types';
import { ExternalLink, Star } from 'lucide-react';
import { Favicon } from '../Favicon';

interface SpeedDialProps {
    links: LinkItem[];
}

export const SpeedDial: React.FC<SpeedDialProps> = ({ links }) => {
    // Top 9 favorites
    const favorites = links.filter(link => link.favorite).slice(0, 9);

    // Keyboard shortcuts (1-9)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            const key = parseInt(e.key);
            if (!isNaN(key) && key >= 1 && key <= 9) {
                const index = key - 1;
                if (favorites[index]) {
                    window.open(favorites[index].url, '_blank');
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [favorites]);

    if (favorites.length === 0) {
        return (
            <div className="w-full max-w-2xl mx-auto mt-8 mb-12 px-4 animate-fade-in text-center opacity-50">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nothing-dark/5 text-nothing-dark/60 text-xs font-mono uppercase tracking-widest">
                    <Star size={12} />
                    <span>Star items to add to Speed Dial</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto mt-8 mb-16 px-4 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-xs uppercase tracking-[0.2em] text-nothing-dark/40 font-mono">
                    Quick Access <span className="text-nothing-accent/60 ml-2">[1-9]</span>
                </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {favorites.map((link, index) => {
                    const hostname = new URL(link.url).hostname;
                    return (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center gap-4 p-4 h-20 bg-nothing-surface/50 hover:bg-white border border-nothing-dark/10 hover:border-nothing-accent/50 transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 overflow-hidden"
                        >
                            {/* Keyboard Shortcut Indicator */}
                            <div className="absolute top-2 right-2 text-[10px] font-mono text-nothing-dark/20 group-hover:text-nothing-accent transition-colors">
                                {index + 1}
                            </div>

                            {/* Icon */}
                            <div className="flex-shrink-0 relative z-10">
                                <Favicon domain={hostname} size={32} className="grayscale group-hover:grayscale-0 transition-all duration-300" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 relative z-10">
                                <h4 className="font-bold text-sm text-nothing-dark truncate group-hover:text-black transition-colors">
                                    {link.title}
                                </h4>
                                <p className="text-[10px] font-mono text-nothing-dark/40 truncate mt-0.5">
                                    {hostname}
                                </p>
                            </div>

                            {/* Hover Arrow */}
                            <div className="absolute right-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-nothing-accent">
                                <ExternalLink size={16} />
                            </div>

                            {/* Dot Matrix Background Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px] transition-opacity duration-300 pointer-events-none" />
                        </a>
                    );
                })}
            </div>
        </div>
    );
};
