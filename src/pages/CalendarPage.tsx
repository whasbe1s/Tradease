import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ScanLine, Loader2, RefreshCw, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getWeekEvents } from '../services/economicCalendar';
import { EconomicEvent, EconomicImpact, Currency } from '../types';
import { useToast } from '../hooks/useToast';
import { useEconomicCalendar } from '../hooks/useEconomicCalendar';

import { Dropdown } from '../components/UI/Dropdown';


export const CalendarPage: React.FC = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { events, loading, refresh } = useEconomicCalendar();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedImpact, setSelectedImpact] = useState<EconomicImpact | 'all'>('all');
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | 'all'>('all');

    const impactOptions = [
        { value: 'all', label: 'All Impact' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
    ];

    const currencyOptions = [
        { value: 'all', label: 'All Cur' },
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
            {/* Header with Integrated Search & Filters */}
            <div className="relative z-20 backdrop-blur-xl bg-glass border border-white/10 ring-1 ring-white/5 rounded-3xl p-4 shadow-2xl mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-nothing-accent/10 text-nothing-accent">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold font-mono text-nothing-dark">Economic Calendar</h1>
                        <p className="text-xs text-nothing-dark/60 font-sans hidden md:block">
                            Global economic events & market impact
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
                    {/* Search */}
                    <div className="relative w-full md:w-48">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-nothing-dark/40 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full pl-9 pr-3 h-9 bg-transparent border border-nothing-dark/10 hover:border-nothing-dark/20 focus:border-nothing-dark/30 rounded-xl text-xs font-mono text-nothing-dark placeholder:text-nothing-dark/30 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="w-full md:w-32">
                            <Dropdown
                                value={selectedImpact}
                                onChange={(val) => setSelectedImpact(val as EconomicImpact | 'all')}
                                options={impactOptions}
                                className="w-full"
                                buttonClassName="h-9 bg-transparent border border-nothing-dark/10 hover:border-nothing-dark/20 px-3 py-0 text-xs"
                                placeholder="Impact"
                            />
                        </div>
                        <div className="w-full md:w-28">
                            <Dropdown
                                value={selectedCurrency}
                                onChange={(val) => setSelectedCurrency(val as Currency | 'all')}
                                options={currencyOptions}
                                className="w-full"
                                buttonClassName="h-9 bg-transparent border border-nothing-dark/10 hover:border-nothing-dark/20 px-3 py-0 text-xs"
                                placeholder="Currency"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => refresh()}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 w-9 h-9 bg-transparent border border-nothing-dark/10 hover:border-nothing-dark/20 text-nothing-dark rounded-xl transition-all font-mono text-xs uppercase tracking-wider"
                        title="Refresh Data"
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    </button>
                </div>
            </div>



            {/* Events Table */}
            <div className="relative z-10 backdrop-blur-xl bg-glass border border-white/10 ring-1 ring-white/5 rounded-3xl overflow-hidden shadow-2xl">
                {Object.keys(groupedEvents).length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                        {loading ? (
                            <>
                                <Loader2 size={48} className="text-nothing-dark/20 mb-4 animate-spin" />
                                <p className="text-nothing-dark/40 font-mono text-sm">Loading calendar...</p>
                            </>
                        ) : (
                            <>
                                <ScanLine size={48} className="text-nothing-dark/20 mb-4" />
                                <p className="text-nothing-dark/40 font-mono text-sm">No events found matching filters</p>
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
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-nothing-dark/5">
                                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider text-nothing-dark/40 font-mono font-normal w-24">Time</th>
                                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider text-nothing-dark/40 font-mono font-normal w-16 text-center">Cur</th>
                                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider text-nothing-dark/40 font-mono font-normal w-16 text-center">Imp</th>
                                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider text-nothing-dark/40 font-mono font-normal">Event</th>

                                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider text-nothing-dark/40 font-mono font-normal w-24 text-right">Forecast</th>
                                    <th className="py-3 px-4 text-[10px] uppercase tracking-wider text-nothing-dark/40 font-mono font-normal w-24 text-right">Previous</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(groupedEvents).map(([date, dateEvents]) => (
                                    <React.Fragment key={date}>
                                        {/* Date Header Row */}
                                        <tr className="bg-nothing-base/60 backdrop-blur-xl border-b border-white/5">
                                            <td colSpan={6} className="py-2 px-4">
                                                <span className="text-nothing-dark font-mono text-xs font-bold uppercase tracking-wider">
                                                    {formatDate(date)}
                                                </span>
                                            </td>
                                        </tr>
                                        {/* Event Rows */}
                                        {dateEvents.map(event => (
                                            <tr
                                                key={event.id}
                                                className="group border-b border-white/5 hover:bg-white/5 transition-colors"
                                            >
                                                <td className="py-3 px-4 font-mono text-xs text-nothing-dark/60 group-hover:text-nothing-dark">
                                                    {event.time}
                                                </td>
                                                <td className="py-3 px-4 font-mono text-xs text-nothing-dark font-bold text-center">
                                                    {event.currency}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className={`inline-block w-2 h-8 rounded-full ${event.impact === 'high' ? 'bg-nothing-accent shadow-[0_0_10px_rgba(232,93,4,0.5)]' :
                                                        event.impact === 'medium' ? 'bg-nothing-dim' :
                                                            'bg-nothing-dark/20'
                                                        }`}></div>
                                                </td>
                                                <td className="py-3 px-4 font-medium text-sm text-nothing-dark/90">
                                                    {event.event}
                                                </td>

                                                <td className="py-3 px-4 font-mono text-xs text-right text-nothing-dark/60">
                                                    {event.forecast || '---'}
                                                </td>
                                                <td className="py-3 px-4 font-mono text-xs text-right text-nothing-dark/40">
                                                    {event.previous || '---'}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
