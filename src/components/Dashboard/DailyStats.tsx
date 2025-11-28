import React from 'react';
import { LinkItem } from '../../types';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface DailyStatsProps {
    links?: LinkItem[];
}

export const DailyStats: React.FC<DailyStatsProps> = ({ links = [] }) => {
    // Calculate Today's Stats
    const today = new Date();
    const todaysTrades = links.filter(link => {
        const tradeDate = new Date(link.created_at);
        return tradeDate.getDate() === today.getDate() &&
            tradeDate.getMonth() === today.getMonth() &&
            tradeDate.getFullYear() === today.getFullYear();
    });

    const todaysPnL = todaysTrades.reduce((acc, trade) => acc + (trade.pnl || 0), 0);
    const winCount = todaysTrades.filter(t => t.outcome === 'win').length;
    const lossCount = todaysTrades.filter(t => t.outcome === 'loss').length;
    const totalTrades = winCount + lossCount;
    const winRate = totalTrades > 0 ? Math.round((winCount / totalTrades) * 100) : 0;

    // Circular Progress Calculation
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (winRate / 100) * circumference;

    return (
        <div
            className="w-full h-full backdrop-blur-xl bg-nothing-base/40 border border-white/10 ring-1 ring-white/5 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-between relative overflow-hidden group"
        >
            {/* Header */}
            <div className="w-full flex justify-between items-start z-10">
                <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-nothing-dark/50">
                        Daily PnL
                    </span>
                    <div className={`text-4xl md:text-5xl font-mono font-bold tracking-tighter mt-1 ${todaysPnL >= 0 ? 'text-nothing-dark' : 'text-nothing-accent'}`}>
                        {todaysPnL >= 0 ? '+' : '-'}${Math.abs(todaysPnL).toLocaleString()}
                    </div>
                </div>
                <div className="p-2 rounded-full bg-nothing-dark/5 text-nothing-dark/40">
                    {todaysPnL >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="w-full grid grid-cols-2 gap-4 z-10 mt-auto">
                {/* Win Rate with Circular Progress */}
                <div className="flex items-center gap-3 bg-nothing-dark/5 p-3 rounded-2xl border border-nothing-dark/5">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="transform -rotate-90 w-12 h-12">
                            <circle
                                cx="24"
                                cy="24"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                className="text-nothing-dark/10"
                            />
                            <circle
                                cx="24"
                                cy="24"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                className="text-nothing-accent transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute text-[10px] font-mono font-bold text-nothing-dark">
                            {winRate}%
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-nothing-dark/40">Win Rate</span>
                        <span className="text-sm font-mono font-bold text-nothing-dark">{winCount}W / {lossCount}L</span>
                    </div>
                </div>

                {/* Total Trades */}
                <div className="flex items-center gap-3 bg-nothing-dark/5 p-3 rounded-2xl border border-nothing-dark/5">
                    <div className="w-12 h-12 rounded-full bg-nothing-dark/10 flex items-center justify-center text-nothing-dark/60">
                        <Activity size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-nothing-dark/40">Trades</span>
                        <span className="text-xl font-mono font-bold text-nothing-dark">{totalTrades}</span>
                    </div>
                </div>
            </div>

            {/* Background Decoration - Dot Matrix */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#435663 1px, transparent 1px)',
                    backgroundSize: '12px 12px'
                }}
            ></div>

            {/* Hover Glow */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-nothing-accent/10 rounded-full blur-3xl group-hover:bg-nothing-accent/20 transition-colors duration-700 pointer-events-none"></div>
        </div>
    );
};
