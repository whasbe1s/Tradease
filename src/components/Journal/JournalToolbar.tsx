import React, { useRef } from 'react';
import { Search, ChevronDown, Filter, ArrowUpDown } from 'lucide-react';

interface JournalToolbarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterMode: 'all' | 'win' | 'loss' | 'favorites';
    setFilterMode: (mode: 'all' | 'win' | 'loss' | 'favorites') => void;
    sortMode: 'newest' | 'oldest' | 'pnl-high' | 'pnl-low' | 'pair-az';
    setSortMode: (mode: 'newest' | 'oldest' | 'pnl-high' | 'pnl-low' | 'pair-az') => void;
    filteredCount: number;
}

export const JournalToolbar: React.FC<JournalToolbarProps> = ({
    searchQuery,
    setSearchQuery,
    filterMode,
    setFilterMode,
    sortMode,
    setSortMode,
    filteredCount
}) => {
    const searchRef = useRef<HTMLInputElement>(null);

    const filterOptions = [
        { value: 'all' as const, label: 'ALL_TRADES' },
        { value: 'win' as const, label: 'WINS_ONLY' },
        { value: 'loss' as const, label: 'LOSSES_ONLY' },
        { value: 'favorites' as const, label: 'FAVORITES' }
    ];

    const sortOptions = [
        { value: 'newest' as const, label: 'NEWEST' },
        { value: 'oldest' as const, label: 'OLDEST' },
        { value: 'pnl-high' as const, label: 'PNL_HIGH' },
        { value: 'pnl-low' as const, label: 'PNL_LOW' },
        { value: 'pair-az' as const, label: 'PAIR_A-Z' }
    ];

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 pb-4 border-b border-nothing-dark/10">
            {/* Search Input */}
            <div className="relative flex-1 w-full md:max-w-xs group">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-nothing-dark/40 group-focus-within:text-nothing-accent transition-colors pointer-events-none" />
                <input
                    ref={searchRef}
                    id="journal-search"
                    name="journal-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="SEARCH_LOGS..."
                    className="w-full pl-9 pr-3 py-2 bg-nothing-dark/5 border border-transparent focus:border-nothing-accent/50 rounded-lg text-[10px] font-mono text-nothing-dark placeholder:text-nothing-dark/30 focus:outline-none transition-all uppercase tracking-wider"
                    autoComplete="off"
                    data-lpignore="true"
                />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                {/* Filter Dropdown */}
                <div className="relative shrink-0">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-nothing-dark/40">
                        <Filter size={10} />
                    </div>
                    <select
                        value={filterMode}
                        onChange={(e) => setFilterMode(e.target.value as typeof filterMode)}
                        className="appearance-none pl-8 pr-8 py-2 bg-nothing-dark/5 border border-transparent hover:bg-nothing-dark/10 focus:border-nothing-accent/50 rounded-lg text-[10px] font-mono font-bold text-nothing-dark focus:outline-none transition-all cursor-pointer uppercase tracking-wider min-w-[120px]"
                    >
                        {filterOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={10} className="absolute right-3 top-1/2 -translate-y-1/2 text-nothing-dark/40 pointer-events-none" />
                </div>

                {/* Sort Dropdown */}
                <div className="relative shrink-0">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-nothing-dark/40">
                        <ArrowUpDown size={10} />
                    </div>
                    <select
                        value={sortMode}
                        onChange={(e) => setSortMode(e.target.value as typeof sortMode)}
                        className="appearance-none pl-8 pr-8 py-2 bg-nothing-dark/5 border border-transparent hover:bg-nothing-dark/10 focus:border-nothing-accent/50 rounded-lg text-[10px] font-mono font-bold text-nothing-dark focus:outline-none transition-all cursor-pointer uppercase tracking-wider min-w-[120px]"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={10} className="absolute right-3 top-1/2 -translate-y-1/2 text-nothing-dark/40 pointer-events-none" />
                </div>
            </div>

            {/* Trade Count */}
            <div className="hidden md:block ml-auto text-[9px] font-mono text-nothing-dark/40 uppercase tracking-widest">
                [{filteredCount.toString().padStart(3, '0')}] RECORDS
            </div>
        </div>
    );
};
