import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, Filter, Search, ScanLine, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getWeekEvents } from '../services/economicCalendar';
import { EconomicEvent, EconomicImpact, Currency } from '../types';
import { useToast } from '../hooks/useToast';
import { useEconomicCalendar } from '../hooks/useEconomicCalendar';

export const CalendarPage: React.FC = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { events, loading, refresh } = useEconomicCalendar();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedImpact, setSelectedImpact] = useState<EconomicImpact | 'all'>('all');
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | 'all'>('all');

    // Filter events
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.currency.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesImpact = selectedImpact === 'all' || event.impact === selectedImpact;
        const matchesCurrency = selectedCurrency === 'all' || event.currency === selectedCurrency;

        return matchesSearch && matchesImpact && matchesCurrency;
    });

    // Group by date
    const groupedEvents: { [date: string]: EconomicEvent[] } = {};
    filteredEvents.forEach(event => {
        if (!groupedEvents[event.date]) {
            groupedEvents[event.date] = [];
        }
        groupedEvents[event.date].push(event);
    });

    const getImpactColor = (impact: string) => {
        switch (impact.toLowerCase()) {
            case 'high':
                return 'bg-nothing-accent/10 text-nothing-accent border-nothing-accent/20';
            case 'medium':
                return 'bg-nothing-dark/10 text-nothing-dark border-nothing-dark/20';
            case 'low':
                return 'bg-transparent text-nothing-dark/40 border-nothing-dark/10';
            case 'holiday':
                return 'bg-nothing-dark/5 text-nothing-dark/30 border-nothing-dark/5';
            default:
                return 'bg-transparent text-nothing-dark/40 border-nothing-dark/10';
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(date);
        eventDate.setHours(0, 0, 0, 0);

        if (eventDate.getTime() === today.getTime()) {
            return 'Today';
        }

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (eventDate.getTime() === tomorrow.getTime()) {
            return 'Tomorrow';
        }

        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-sm font-mono text-nothing-dark/60 hover:text-nothing-dark transition-colors mb-4"
                    >
                        <ChevronLeft size={16} />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar size={24} className="text-nothing-accent" />
                        <h1 className="text-2xl font-bold font-mono text-nothing-dark">Economic Calendar</h1>
                    </div>
                    <p className="text-sm text-nothing-dark/60 font-sans">
                        Track important economic events and their impact on the markets
                    </p>
                </div>

                {/* Scan Button */}
                {/* Refresh Button */}
                <button
                    onClick={() => refresh()}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-nothing-dark/5 hover:bg-nothing-dark/10 text-nothing-dark rounded-xl transition-all font-mono text-xs uppercase tracking-wider"
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    {loading ? 'Updating...' : 'Refresh Data'}
                </button>
            </div>

            {/* Filters & Search */}
            <div
                className="backdrop-blur-md border border-nothing-dark/10 rounded-3xl p-6 shadow-xl mb-6"
                style={{ backgroundColor: `rgba(67, 86, 99, var(--bento - opacity))` }}
            >
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-nothing-dark/40 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search events..."
                            className="w-full pl-9 pr-3 py-2 bg-transparent border border-nothing-dark/10 hover:border-nothing-dark/20 focus:border-nothing-dark/30 rounded-lg text-xs font-mono text-nothing-dark placeholder:text-nothing-dark/30 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Impact Filter */}
                    <select
                        value={selectedImpact}
                        onChange={(e) => setSelectedImpact(e.target.value as EconomicImpact | 'all')}
                        className="px-3 py-2 bg-transparent border border-nothing-dark/10 hover:border-nothing-dark/20 focus:border-nothing-dark/30 rounded-lg text-xs font-mono text-nothing-dark focus:outline-none transition-colors cursor-pointer"
                    >
                        <option value="all">All Impact Levels</option>
                        <option value="high">High Impact</option>
                        <option value="medium">Medium Impact</option>
                        <option value="low">Low Impact</option>
                    </select>

                    {/* Currency Filter */}
                    <select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value as Currency | 'all')}
                        className="px-3 py-2 bg-transparent border border-nothing-dark/10 hover:border-nothing-dark/20 focus:border-nothing-dark/30 rounded-lg text-xs font-mono text-nothing-dark focus:outline-none transition-colors cursor-pointer"
                    >
                        <option value="all">All Currencies</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                        <option value="AUD">AUD</option>
                        <option value="CAD">CAD</option>
                    </select>
                </div>
            </div>

            {/* Events by Date */}
            <div className="space-y-6">
                {Object.keys(groupedEvents).length === 0 ? (
                    <div
                        className="backdrop-blur-md border border-nothing-dark/10 rounded-3xl p-12 shadow-xl text-center flex flex-col items-center justify-center"
                        style={{ backgroundColor: `rgba(67, 86, 99, var(--bento - opacity))` }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={48} className="text-nothing-dark/20 mb-4 animate-spin" />
                                <p className="text-nothing-dark/40 font-mono text-sm">Loading calendar...</p>
                            </>
                        ) : (
                            <>
                                <ScanLine size={48} className="text-nothing-dark/20 mb-4" />
                                <p className="text-nothing-dark/40 font-mono text-sm">No events loaded</p>
                                <button
                                    onClick={() => refresh()}
                                    className="mt-4 text-xs text-nothing-accent hover:underline flex items-center gap-2"
                                >
                                    <RefreshCw size={12} />
                                    Refresh Data
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    Object.entries(groupedEvents).map(([date, dateEvents]) => (
                        <div key={date}>
                            {/* Date Header */}
                            <div className="mb-3 flex items-center gap-3">
                                <h2 className="text-sm font-bold font-mono text-nothing-dark">{formatDate(date)}</h2>
                                <div className="flex-1 h-px bg-nothing-dark/10"></div>
                                <span className="text-xs font-mono text-nothing-dark/40">{dateEvents.length} events</span>
                            </div>

                            {/* Events */}
                            <div
                                className="backdrop-blur-md border border-nothing-dark/10 rounded-3xl p-6 shadow-xl space-y-3"
                                style={{ backgroundColor: `rgba(67, 86, 99, var(--bento - opacity))` }}
                            >
                                {dateEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className="p-4 rounded-lg bg-white/40 border border-nothing-dark/5 hover:border-nothing-dark/20 transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-mono font-bold text-lg">{event.time}</span>
                                                    <span className="text-xs font-bold bg-nothing-dark/10 px-2 py-1 rounded text-nothing-dark/60">
                                                        {event.currency}
                                                    </span>
                                                    <div className={`
px - 2 py - 1 rounded - full text - [10px] font - bold uppercase tracking - wider border
                                                        ${getImpactColor(event.impact)}
`}>
                                                        {event.impact}
                                                    </div>
                                                </div>
                                                <h3 className="font-medium text-sm text-nothing-dark/90 mb-2">{event.event}</h3>
                                                <div className="flex gap-6 text-xs font-mono">
                                                    <div>
                                                        <span className="text-nothing-dark/40">Forecast:</span>
                                                        <span className="text-nothing-dark ml-1">{event.forecast}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-nothing-dark/40">Previous:</span>
                                                        <span className="text-nothing-dark ml-1">{event.previous}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
