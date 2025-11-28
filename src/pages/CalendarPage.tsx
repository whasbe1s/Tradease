import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, Filter, Search, ScanLine, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getWeekEvents } from '../services/economicCalendar';
import { EconomicEvent, EconomicImpact, Currency } from '../types';
import { useToast } from '../hooks/useToast';
import { useEconomicCalendar } from '../hooks/useEconomicCalendar';
import { Badge } from '../components/UI/Badge';
import { Dropdown } from '../components/UI/Dropdown';

export const CalendarPage: React.FC = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { events, loading, refresh } = useEconomicCalendar();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedImpact, setSelectedImpact] = useState<EconomicImpact | 'all'>('all');
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | 'all'>('all');

    const impactOptions = [
        { value: 'all', label: 'All Impact Levels' },
        { value: 'high', label: 'High Impact' },
        { value: 'medium', label: 'Medium Impact' },
        { value: 'low', label: 'Low Impact' },
    ];

    const currencyOptions = [
        { value: 'all', label: 'All Currencies' },
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
        { value: 'JPY', label: 'JPY' },
        { value: 'AUD', label: 'AUD' },
        { value: 'CAD', label: 'CAD' },
    ];

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
            case 'high': return 'accent';
            case 'medium': return 'warning';
            case 'low': return 'neutral';
            default: return 'neutral';
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

                <button
                    onClick={() => refresh()}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-nothing-dark/5 hover:bg-nothing-dark/10 text-nothing-dark rounded-xl transition-all font-mono text-xs uppercase tracking-wider"
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    {loading ? 'Updating...' : 'Refresh Data'}
                </button>
            </div>

            {/* Filters & Search - Bento Style */}
            <div
                className="backdrop-blur-xl bg-nothing-base/40 border border-white/10 ring-1 ring-white/5 rounded-3xl p-6 shadow-2xl mb-8"
            >
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-nothing-dark/40 pointer-events-none" />
                        <input
                            id="calendar-search"
                            name="calendar-search"
                            type="text"
                            autoComplete="off"
                            data-lpignore="true"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search events..."
                            className="w-full pl-9 pr-3 py-2 bg-nothing-dark/5 border border-transparent hover:border-nothing-dark/10 focus:border-nothing-dark/20 rounded-xl text-xs font-mono text-nothing-dark placeholder:text-nothing-dark/30 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Impact Filter */}
                    <div className="w-full md:w-48">
                        <Dropdown
                            value={selectedImpact}
                            onChange={(val) => setSelectedImpact(val as EconomicImpact | 'all')}
                            options={impactOptions}
                        />
                    </div>

                    {/* Currency Filter */}
                    <div className="w-full md:w-48">
                        <Dropdown
                            value={selectedCurrency}
                            onChange={(val) => setSelectedCurrency(val as Currency | 'all')}
                            options={currencyOptions}
                        />
                    </div>
                </div>
            </div>

            {/* Events by Date */}
            <div className="space-y-8">
                {Object.keys(groupedEvents).length === 0 ? (
                    <div
                        className="backdrop-blur-xl bg-nothing-base/40 border border-white/10 ring-1 ring-white/5 rounded-3xl p-12 shadow-2xl text-center flex flex-col items-center justify-center min-h-[300px]"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={48} className="text-nothing-dark/20 mb-4 animate-spin" />
                                <p className="text-nothing-dark/40 font-mono text-sm">Loading calendar...</p>
                            </>
                        ) : (
                            <>
                                <ScanLine size={48} className="text-nothing-dark/20 mb-4" />
                                <p className="text-nothing-dark/40 font-mono text-sm">No events found matching your filters</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedImpact('all');
                                        setSelectedCurrency('all');
                                    }}
                                    className="mt-4 text-xs text-nothing-accent hover:underline"
                                >
                                    Clear Filters
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    Object.entries(groupedEvents).map(([date, dateEvents]) => (
                        <div key={date} className="animate-fade-in-up">
                            {/* Date Header */}
                            <div className="mb-4 flex items-center gap-4">
                                <div className="px-3 py-1 rounded-full bg-nothing-dark/10 text-nothing-dark font-mono text-xs font-bold uppercase tracking-wider">
                                    {formatDate(date)}
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-nothing-dark/10 to-transparent"></div>
                            </div>

                            {/* Events Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {dateEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className="group backdrop-blur-xl bg-nothing-base/40 border border-white/5 hover:border-nothing-accent/20 ring-1 ring-white/5 rounded-2xl p-5 shadow-lg transition-all hover:shadow-nothing-accent/5 hover:-translate-y-1"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="soft" color="neutral" className="font-mono">
                                                    {event.time}
                                                </Badge>
                                                <Badge variant="outline" color="neutral">
                                                    {event.currency}
                                                </Badge>
                                            </div>
                                            <Badge
                                                variant={event.impact === 'high' ? 'default' : 'soft'}
                                                color={getImpactColor(event.impact) as any}
                                            >
                                                {event.impact}
                                            </Badge>
                                        </div>

                                        <h3 className="font-medium text-sm text-nothing-dark/90 mb-4 line-clamp-2 min-h-[40px]">
                                            {event.event}
                                        </h3>

                                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider text-nothing-dark/40 mb-1">Actual</span>
                                                <span className={`font-mono text-xs font-bold ${event.actual ? 'text-nothing-dark' : 'text-nothing-dark/20'}`}>
                                                    {event.actual || '---'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col border-l border-white/5 pl-3">
                                                <span className="text-[10px] uppercase tracking-wider text-nothing-dark/40 mb-1">Forecast</span>
                                                <span className="font-mono text-xs text-nothing-dark/80">
                                                    {event.forecast || '---'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col border-l border-white/5 pl-3">
                                                <span className="text-[10px] uppercase tracking-wider text-nothing-dark/40 mb-1">Previous</span>
                                                <span className="font-mono text-xs text-nothing-dark/60">
                                                    {event.previous || '---'}
                                                </span>
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
