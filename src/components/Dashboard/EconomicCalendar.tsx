import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight, ScanLine, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getNextEvent, getTimeUntilEvent } from '../../services/economicCalendar';
import { EconomicEvent } from '../../types';
import { useEconomicCalendar } from '../../hooks/useEconomicCalendar';

export const EconomicCalendar: React.FC = () => {
    const navigate = useNavigate();
    const { events, loading, refresh } = useEconomicCalendar();
    const [displayEvents, setDisplayEvents] = useState<EconomicEvent[]>([]);
    const [nextEvent, setNextEvent] = useState<EconomicEvent | null>(null);
    const [timeUntilNext, setTimeUntilNext] = useState('');

    // Process events when they change
    useEffect(() => {
        if (events.length > 0) {
            // Filter for USD events for today only
            const todayStr = new Date().toISOString().split('T')[0];
            const usdEvents = events.filter(e =>
                e.currency === 'USD' && e.date === todayStr
            );

            setDisplayEvents(usdEvents);

            // Find next upcoming event for countdown
            const now = new Date();
            const next = usdEvents.find(e => {
                const eventDate = new Date(`${e.date}T${e.time}`);
                return eventDate > now;
            });
            setNextEvent(next || null);
        } else {
            setDisplayEvents([]);
            setNextEvent(null);
        }
    }, [events]);

    // Update countdown every second
    useEffect(() => {
        if (!nextEvent) {
            setTimeUntilNext('');
            return;
        }

        const updateCountdown = () => {
            const { hours, minutes, seconds } = getTimeUntilEvent(nextEvent);
            setTimeUntilNext(`${hours}:${minutes}:${seconds}`);
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [nextEvent]);

    const renderImpactDots = (impact: string) => {
        const level = impact.toLowerCase();
        let count = 1;
        let color = 'bg-nothing-dark/20';

        if (level === 'high') { count = 3; color = 'bg-nothing-accent'; }
        else if (level === 'medium') { count = 2; color = 'bg-nothing-dark'; }

        return (
            <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${i < count ? color : 'bg-nothing-dark/10'}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div
            className="w-full h-full backdrop-blur-md border border-nothing-dark/10 rounded-3xl p-6 shadow-xl flex flex-col relative overflow-hidden group bg-nothing-base/50"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 z-10">
                <div className="flex flex-col">
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-nothing-dark/50">
                        Economic Data
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono text-nothing-dark/30">TODAY'S SCHEDULE</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {nextEvent && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-nothing-dark/5 border border-nothing-dark/5">
                            <Clock size={10} className="text-nothing-accent" />
                            <span className="font-mono font-bold text-xs text-nothing-dark">{timeUntilNext}</span>
                        </div>
                    )}
                    <button
                        onClick={() => refresh()}
                        disabled={loading}
                        className="p-1.5 rounded-lg hover:bg-nothing-dark/10 text-nothing-dark/40 hover:text-nothing-dark transition-colors"
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    </button>
                </div>
            </div>

            {/* Events List */}
            <div className="flex-1 relative min-h-0 z-10">
                <div className="h-full overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                    {displayEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8 text-nothing-dark/40">
                            {loading ? (
                                <>
                                    <Loader2 size={24} className="mb-2 opacity-50 animate-spin" />
                                    <p className="text-xs font-mono">SYNCING_CALENDAR...</p>
                                </>
                            ) : (
                                <>
                                    <ScanLine size={24} className="mb-2 opacity-50" />
                                    <p className="text-xs font-mono">NO_DATA_FOUND</p>
                                </>
                            )}
                        </div>
                    ) : (
                        displayEvents.map((event) => (
                            <div
                                key={event.id}
                                className="group/item relative p-3 rounded-xl border border-transparent hover:border-nothing-dark/10 hover:bg-nothing-dark/5 transition-all"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="font-mono text-xs text-nothing-dark/50 w-12 shrink-0">{event.time}</span>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-medium text-xs text-nothing-dark/90 truncate pr-2">
                                                {event.event}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-3">
                                        <span className="text-[9px] font-mono font-bold text-nothing-dark/40 uppercase tracking-wider w-8 text-right">
                                            {event.currency}
                                        </span>
                                        {renderImpactDots(event.impact)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Fade gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-nothing-base/50 to-transparent pointer-events-none" />
            </div>

            {/* Footer Action */}
            <button
                onClick={() => navigate('/calendar')}
                className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 hover:text-nothing-dark hover:bg-nothing-dark/5 rounded-xl transition-all group border border-dashed border-nothing-dark/10 hover:border-nothing-dark/20"
            >
                View Full Calendar
                <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Background Decoration - Dot Matrix */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#435663 1px, transparent 1px)',
                    backgroundSize: '12px 12px'
                }}
            ></div>
        </div>
    );
};
