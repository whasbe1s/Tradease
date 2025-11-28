import React from 'react';
import { BarChart2, TrendingUp, TrendingDown, Target, Activity, DollarSign, Percent } from 'lucide-react';
import { TradeStats } from '../../hooks/useTradeStats';
import { StatCard } from './StatCard';
import { EquityChart } from './EquityChart';
import { WinRateDonut } from './WinRateDonut';
import { PairPerformance } from './PairPerformance';

interface StatsContentProps {
    stats: TradeStats;
}

export const StatsContent: React.FC<StatsContentProps> = ({ stats }) => {
    return (
        <div className="w-full max-w-7xl mx-auto space-y-6">

            {/* Header Section */}
            <div
                className="w-full backdrop-blur-xl bg-nothing-base/40 border border-white/10 ring-1 ring-white/5 rounded-3xl p-6 shadow-2xl flex items-center justify-between"
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

            {/* Primary KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Net PnL"
                    value={`$${stats.netPnL.toFixed(2)}`}
                    subValue={`${stats.totalTrades} Trades`}
                    icon={DollarSign}
                    color={stats.netPnL >= 0 ? 'text-trade-win' : 'text-trade-loss'}
                    bgGlow={stats.netPnL >= 0 ? 'bg-trade-win/5' : 'bg-trade-loss/5'}
                />
                <StatCard
                    label="Win Rate"
                    value={`${stats.winRate.toFixed(1)}%`}
                    subValue={`Avg Win: $${stats.avgWin.toFixed(0)}`}
                    icon={Percent}
                    color={stats.winRate >= 50 ? 'text-nothing-dark' : 'text-nothing-dark/60'}
                />
                <StatCard
                    label="Profit Factor"
                    value={stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
                    subValue={`Expectancy: $${stats.expectancy.toFixed(2)}`}
                    icon={Activity}
                    color="text-nothing-accent"
                    bgGlow="bg-nothing-accent/5"
                />
                <StatCard
                    label="Max Drawdown"
                    value={`${stats.maxDrawdownPercent.toFixed(1)}%`}
                    subValue={`-$${stats.maxDrawdown.toFixed(2)}`}
                    icon={TrendingDown}
                    color="text-trade-loss"
                    bgGlow="bg-trade-loss/5"
                />
            </div>

            {/* Main Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <EquityChart data={stats.pnlCurve} />
                </div>
                <div className="lg:col-span-1">
                    <WinRateDonut wins={stats.wins} losses={stats.losses} breakevens={stats.breakevens} />
                </div>
            </div>

            {/* Secondary Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <PairPerformance data={stats.pairStats.slice(0, 5)} />
                </div>

                {/* Long vs Short Stats */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatCard
                        label="Long Performance"
                        value={`${stats.longStats.winRate.toFixed(1)}%`}
                        subValue={`PnL: $${stats.longStats.pnl.toFixed(2)} (${stats.longStats.count})`}
                        icon={TrendingUp}
                        color="text-trade-win"
                        bgGlow="bg-trade-win/5"
                    />
                    <StatCard
                        label="Short Performance"
                        value={`${stats.shortStats.winRate.toFixed(1)}%`}
                        subValue={`PnL: $${stats.shortStats.pnl.toFixed(2)} (${stats.shortStats.count})`}
                        icon={TrendingDown}
                        color="text-trade-loss"
                        bgGlow="bg-trade-loss/5"
                    />
                </div>
            </div>
        </div>
    );
};
