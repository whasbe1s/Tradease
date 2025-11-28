import React from 'react';
import { BarChart2 } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    LabelList
} from 'recharts';
import { TradeStats } from '../../hooks/useTradeStats';

interface StatsContentProps {
    stats: TradeStats;
}

export const StatsContent: React.FC<StatsContentProps> = ({ stats }) => {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-nothing-surface/90 backdrop-blur border border-nothing-dark/10 rounded-lg p-3 text-xs font-mono shadow-xl">
                    <p className="text-nothing-dark/60 mb-1">{label}</p>
                    <p className={`font-bold text-sm ${payload[0].value >= 0 ? 'text-nothing-dark' : 'text-red-500'}`}>
                        {payload[0].value >= 0 ? '+' : ''}{payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">

            {/* Header Section */}
            <div
                className="w-full backdrop-blur-md border border-nothing-dark/5 rounded-3xl p-6 shadow-xl flex items-center justify-between"
                style={{ backgroundColor: `rgba(67, 86, 99, var(--bento-opacity))` }}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-nothing-dark/5 rounded-full">
                        <BarChart2 size={20} className="text-nothing-dark" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-nothing-dark tracking-tight">System Analytics</h2>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40">Performance Overview</p>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Win Rate */}
                <div
                    className="backdrop-blur-md border border-nothing-dark/5 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center gap-2 relative overflow-hidden group"
                    style={{ backgroundColor: `rgba(67, 86, 99, var(--bento-opacity))` }}
                >
                    <span className="text-[10px] font-mono uppercase text-nothing-dark/40 tracking-[0.2em]">Win Rate</span>
                    <span className={`text-4xl font-light tabular-nums ${stats.winRate >= 50 ? 'text-nothing-dark' : 'text-nothing-dark/60'}`}>
                        {stats.winRate.toFixed(1)}<span className="text-lg opacity-50">%</span>
                    </span>
                    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-colors duration-500"></div>
                </div>

                {/* Net PnL */}
                <div
                    className="backdrop-blur-md border border-nothing-dark/5 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center gap-2 relative overflow-hidden group"
                    style={{ backgroundColor: `rgba(67, 86, 99, var(--bento-opacity))` }}
                >
                    <span className="text-[10px] font-mono uppercase text-nothing-dark/40 tracking-[0.2em]">Net PnL</span>
                    <span className={`text-4xl font-light tabular-nums ${stats.netPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stats.netPnL >= 0 ? '+' : ''}{stats.netPnL.toFixed(2)}
                    </span>
                    <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl transition-colors duration-500 ${stats.netPnL >= 0 ? 'bg-green-500/5 group-hover:bg-green-500/10' : 'bg-red-500/5 group-hover:bg-red-500/10'}`}></div>
                </div>

                {/* Profit Factor */}
                <div
                    className="backdrop-blur-md border border-nothing-dark/5 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center gap-2 relative overflow-hidden group"
                    style={{ backgroundColor: `rgba(67, 86, 99, var(--bento-opacity))` }}
                >
                    <span className="text-[10px] font-mono uppercase text-nothing-dark/40 tracking-[0.2em]">Profit Factor</span>
                    <span className="text-4xl font-light tabular-nums text-nothing-dark">
                        {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
                    </span>
                    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors duration-500"></div>
                </div>

                {/* Total Trades */}
                <div
                    className="backdrop-blur-md border border-nothing-dark/5 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center gap-2 relative overflow-hidden group"
                    style={{ backgroundColor: `rgba(67, 86, 99, var(--bento-opacity))` }}
                >
                    <span className="text-[10px] font-mono uppercase text-nothing-dark/40 tracking-[0.2em]">Total Trades</span>
                    <span className="text-4xl font-light tabular-nums text-nothing-dark">
                        {stats.totalTrades}
                    </span>
                    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-nothing-dark/5 rounded-full blur-2xl group-hover:bg-nothing-dark/10 transition-colors duration-500"></div>
                </div>
            </div>

            {/* Main Chart Section */}
            <div
                className="w-full backdrop-blur-md border border-nothing-dark/5 rounded-3xl p-6 shadow-xl relative overflow-hidden"
                style={{ backgroundColor: `rgba(67, 86, 99, var(--bento-opacity))` }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="text-[10px] font-mono uppercase tracking-[0.5em] text-nothing-base/60">Equity Curve</div>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.pnlCurve}>
                            <defs>
                                <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D71921" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#D71921" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#ffffff20"
                                tick={{ fontSize: 11, fontFamily: 'monospace', fill: '#ffffff80' }}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                                dy={10}
                            />
                            <YAxis
                                stroke="#ffffff20"
                                tick={{ fontSize: 11, fontFamily: 'monospace', fill: '#ffffff80' }}
                                tickLine={false}
                                axisLine={false}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
                            <Area
                                type="monotone"
                                dataKey="cumulative"
                                stroke="#D71921"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorPnL)"
                                activeDot={{ r: 6, fill: '#D71921', stroke: '#fff', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Secondary Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Pair Performance */}
                <div
                    className="backdrop-blur-md border border-nothing-dark/5 rounded-3xl p-6 shadow-xl relative overflow-hidden"
                    style={{ backgroundColor: `rgba(67, 86, 99, var(--bento-opacity))` }}
                >
                    <div className="mb-6">
                        <div className="text-[10px] font-mono uppercase tracking-[0.5em] text-nothing-base/60">Top Pairs</div>
                    </div>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.pairStats.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 50, left: 20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="pair"
                                    type="category"
                                    stroke="#ffffff20"
                                    tick={{ fontSize: 11, fontFamily: 'monospace', fill: '#ffffff90', fontWeight: 'bold' }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={60}
                                />
                                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                                <Bar dataKey="pnl" barSize={20} radius={[0, 4, 4, 0]}>
                                    {stats.pairStats.slice(0, 5).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#ffffff' : '#D71921'} />
                                    ))}
                                    <LabelList
                                        dataKey="pnl"
                                        position="right"
                                        style={{ fontSize: '10px', fontFamily: 'monospace', fill: '#ffffff80' }}
                                        formatter={(value: number) => value >= 0 ? `+$${value}` : `-$${Math.abs(value)}`}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Outcome Distribution */}
                <div
                    className="backdrop-blur-md border border-nothing-dark/5 rounded-3xl p-6 shadow-xl relative overflow-hidden"
                    style={{ backgroundColor: `rgba(67, 86, 99, var(--bento-opacity))` }}
                >
                    <div className="mb-6">
                        <div className="text-[10px] font-mono uppercase tracking-[0.5em] text-nothing-base/60">Outcome Distribution</div>
                    </div>

                    <div className="flex items-end justify-center gap-12 h-[250px] pb-4">
                        <div className="flex flex-col items-center gap-3 group w-16">
                            <div className="w-full bg-green-500/10 group-hover:bg-green-500/20 transition-all duration-500 relative rounded-t-xl" style={{ height: `${stats.totalTrades > 0 ? (stats.wins / stats.totalTrades) * 180 : 0}px`, minHeight: '4px' }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-lg font-light tabular-nums text-green-400">{stats.wins}</div>
                            </div>
                            <span className="text-[10px] font-mono uppercase text-nothing-base/60 tracking-widest">Wins</span>
                        </div>

                        <div className="flex flex-col items-center gap-3 group w-16">
                            <div className="w-full bg-red-500/10 group-hover:bg-red-500/20 transition-all duration-500 relative rounded-t-xl" style={{ height: `${stats.totalTrades > 0 ? (stats.losses / stats.totalTrades) * 180 : 0}px`, minHeight: '4px' }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-lg font-light tabular-nums text-red-400">{stats.losses}</div>
                            </div>
                            <span className="text-[10px] font-mono uppercase text-nothing-base/60 tracking-widest">Losses</span>
                        </div>

                        <div className="flex flex-col items-center gap-3 group w-16">
                            <div className="w-full bg-nothing-dark/5 group-hover:bg-nothing-dark/10 transition-all duration-500 relative rounded-t-xl" style={{ height: `${stats.totalTrades > 0 ? (stats.breakevens / stats.totalTrades) * 180 : 0}px`, minHeight: '4px' }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-lg font-light tabular-nums text-nothing-base/80">{stats.breakevens}</div>
                            </div>
                            <span className="text-[10px] font-mono uppercase text-nothing-base/60 tracking-widest">BE</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
