import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Terminal, Cpu } from 'lucide-react';
import { fetchRealEvents } from '../../services/economicCalendar';
import { useIsMounted } from '../../hooks/useIsMounted';
import { analyzeMarketOutlook } from '../../services/geminiService';

export const AIAnalysisWidget: React.FC = () => {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const isMounted = useIsMounted();

    const generateAnalysis = async () => {
        setLoading(true);
        try {
            // 1. Fetch today's events
            const events = await fetchRealEvents();
            const todayStr = new Date().toISOString().split('T')[0];
            const todayEvents = events.filter(e => e.date === todayStr && e.currency === 'USD');

            if (todayEvents.length === 0) {
                if (isMounted()) {
                    setAnalysis("No significant USD economic events scheduled for today. Market volatility may be lower than usual. Focus on technical setups.");
                    setLoading(false);
                }
                return;
            }

            // 2. Prepare prompt for Gemini
            const eventsText = todayEvents.map(e =>
                `- ${e.time} ${e.currency} ${e.event} (Impact: ${e.impact})`
            ).join('\n');

            // 3. Call Gemini via Edge Function
            const text = await analyzeMarketOutlook(eventsText);

            if (isMounted()) {
                setAnalysis(text);
                setLastUpdated(new Date());
            }

        } catch (error) {
            console.error("AI Analysis failed:", error);
            if (isMounted()) {
                setAnalysis("AI systems offline. Unable to generate market outlook.");
            }
        } finally {
            if (isMounted()) {
                setLoading(false);
            }
        }
    };

    // Auto-generate on mount if empty
    useEffect(() => {
        if (!analysis) {
            generateAnalysis();
        }
    }, []);

    return (
        <div
            className="w-full h-full backdrop-blur-xl bg-glass border border-white/10 ring-1 ring-white/5 rounded-3xl p-6 shadow-2xl flex flex-col relative overflow-hidden group"
        >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-nothing-dark/10 bg-nothing-dark/5">
                <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-nothing-accent" />
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-nothing-dark/50">
                        AI_INSIGHT.EXE
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {lastUpdated && (
                        <span className="text-[9px] font-mono text-nothing-dark/30 hidden sm:inline">
                            LAST_RUN: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                    <button
                        onClick={generateAnalysis}
                        disabled={loading}
                        className={`text-nothing-dark/20 hover:text-nothing-accent transition-colors ${loading ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw size={12} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 relative font-mono text-sm overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-nothing-dark/40">
                        <Cpu size={24} className="animate-pulse text-nothing-accent/50" />
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xs animate-pulse">INITIALIZING_NEURAL_NET...</span>
                            <span className="text-[10px] opacity-50">PROCESSING_MARKET_DATA_STREAMS</span>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <div className="flex gap-2 mb-2 text-nothing-accent/50 text-xs">
                            <span>{'>'}</span>
                            <span className="animate-pulse">_</span>
                        </div>
                        <p className="text-nothing-dark/80 leading-relaxed whitespace-pre-wrap">
                            {analysis ? (
                                <span className="typing-effect">{analysis}</span>
                            ) : (
                                "System ready. Click refresh to generate daily market outlook."
                            )}
                        </p>
                    </div>
                )}
            </div>

            {/* Background Decoration - Dot Matrix */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#435663 1px, transparent 1px)',
                    backgroundSize: '12px 12px'
                }}
            ></div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(transparent_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]"></div>
        </div>
    );
};
