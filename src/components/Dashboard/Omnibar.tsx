import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { enrichLinkData } from '../../services/geminiService';
import { LinkItem } from '../../types';

interface OmnibarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onAddLink: (link: LinkItem) => void;
    addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const Omnibar: React.FC<OmnibarProps> = ({ searchQuery, setSearchQuery, onAddLink, addToast }) => {
    const [input, setInput] = useState(searchQuery);
    const [isUrl, setIsUrl] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [autoTag, setAutoTag] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setInput(searchQuery);
    }, [searchQuery]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInput(val);

        // Simple URL detection
        const urlPattern = /^(https?:\/\/|www\.)/i;
        const isLikelyUrl = urlPattern.test(val);
        setIsUrl(isLikelyUrl);

        if (!isLikelyUrl) {
            setSearchQuery(val);
        }
    };

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && isUrl && !isProcessing) {
            e.preventDefault();
            await handleAddLink();
        }
    };

    const handleAddLink = async () => {
        if (!input.trim()) return;

        setIsProcessing(true);
        try {
            const enriched = await enrichLinkData(input, undefined, { skipTags: !autoTag });

            const newLink: LinkItem = {
                id: crypto.randomUUID(),
                url: input,
                title: enriched.title || new URL(input).hostname,
                description: enriched.description || '',
                tags: enriched.tags || [],
                created_at: new Date().toISOString(),
                favorite: false,
            };

            onAddLink(newLink);
            setInput('');
            setSearchQuery('');
            setIsUrl(false);
        } catch (error) {
            addToast("Failed to process link", 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-12 animate-fade-in-up">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-nothing-dark/40 transition-colors duration-300">
                    {isProcessing ? (
                        <Loader2 size={20} className="animate-spin text-nothing-accent" />
                    ) : isUrl ? (
                        <Plus size={20} className="text-nothing-accent" />
                    ) : (
                        <Search size={20} className="group-focus-within:text-nothing-dark" />
                    )}
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={isUrl ? "Press Enter to save..." : "Search or paste URL..."}
                    className="omnibar-input w-full bg-transparent border-b-2 border-nothing-dark/10 py-4 pl-12 pr-20 text-xl font-light focus:outline-none focus:border-nothing-dark/50 transition-all placeholder:text-nothing-dark/20 rounded-none"
                    autoComplete="off"
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isUrl && (
                        <button
                            onClick={() => setAutoTag(!autoTag)}
                            className={`p-2 transition-colors ${autoTag ? 'text-nothing-accent' : 'text-nothing-dark/20 hover:text-nothing-dark/40'}`}
                            title={autoTag ? "Auto-tagging ON" : "Auto-tagging OFF"}
                            disabled={isProcessing}
                        >
                            <Sparkles size={18} className={autoTag ? "fill-current" : ""} />
                        </button>
                    )}

                    {input && (
                        <button
                            onClick={isUrl ? handleAddLink : () => { setInput(''); setSearchQuery(''); setIsUrl(false); }}
                            className="text-nothing-dark/20 hover:text-nothing-dark transition-colors p-2"
                            disabled={isProcessing}
                        >
                            {isUrl ? <ArrowRight size={20} /> : <Plus size={20} className="rotate-45" />}
                        </button>
                    )}
                </div>

                {/* Progress Bar for processing */}
                <div className={`absolute bottom-0 left-0 h-[2px] bg-nothing-accent transition-all duration-1000 ease-out ${isProcessing ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
            </div>

            {/* Helper text */}
            <div className={`mt-2 text-center transition-opacity duration-300 ${isUrl ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40">
                    {isProcessing ? 'Analyzing content...' : autoTag ? 'Hit Enter to capture with AI tags' : 'Hit Enter to capture to Inbox'}
                </p>
            </div>
        </div>
    );
};
