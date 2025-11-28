import { useMemo } from 'react';
import { LinkItem } from '../types';

export interface TradeStats {
    totalTrades: number;
    winRate: number;
    netPnL: number;
    profitFactor: number;
    wins: number;
    losses: number;
    breakevens: number;
    maxDrawdown: number;
    maxDrawdownPercent: number;
    avgWin: number;
    avgLoss: number;
    expectancy: number;
    bestTrade: number;
    worstTrade: number;
    longStats: { count: number; winRate: number; pnl: number };
    shortStats: { count: number; winRate: number; pnl: number };
    pnlCurve: { date: string; pnl: number; cumulative: number; drawdown: number }[];
    pairStats: { pair: string; count: number; pnl: number; winRate: number; profitFactor: number }[];
}

export const useTradeStats = (links: LinkItem[], startingBalance: number = 0): TradeStats => {
    return useMemo(() => {
        const trades = links.filter(l => l.type === 'trade');
        const totalTrades = trades.length;

        if (totalTrades === 0) {
            return {
                totalTrades: 0,
                winRate: 0,
                netPnL: 0,
                profitFactor: 0,
                wins: 0,
                losses: 0,
                breakevens: 0,
                maxDrawdown: 0,
                maxDrawdownPercent: 0,
                avgWin: 0,
                avgLoss: 0,
                expectancy: 0,
                bestTrade: 0,
                worstTrade: 0,
                longStats: { count: 0, winRate: 0, pnl: 0 },
                shortStats: { count: 0, winRate: 0, pnl: 0 },
                pnlCurve: [{ date: 'Start', pnl: 0, cumulative: startingBalance, drawdown: 0 }],
                pairStats: []
            };
        }

        let wins = 0;
        let losses = 0;
        let breakevens = 0;
        let grossProfit = 0;
        let grossLoss = 0;
        let netPnL = 0;
        let maxPeak = startingBalance;
        let maxDrawdown = 0;
        let maxDrawdownPercent = 0;
        let bestTrade = -Infinity;
        let worstTrade = Infinity;

        // Directional Stats
        const longStats = { count: 0, wins: 0, pnl: 0 };
        const shortStats = { count: 0, wins: 0, pnl: 0 };

        // Sort trades by date ascending for curve
        const sortedTrades = [...trades].sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        const pnlCurve: { date: string; pnl: number; cumulative: number; drawdown: number }[] = [];
        // Initialize curve with starting balance
        pnlCurve.push({ date: 'Start', pnl: 0, cumulative: startingBalance, drawdown: 0 });

        let cumulativePnL = startingBalance;

        const pairMap = new Map<string, { count: number; pnl: number; wins: number; grossProfit: number; grossLoss: number }>();

        sortedTrades.forEach(trade => {
            const pnl = Number(trade.pnl) || 0;
            const pair = trade.pair || 'UNKNOWN';
            const direction = trade.direction || 'long';

            // Global Stats
            netPnL += pnl;
            cumulativePnL += pnl;

            // Drawdown Calculation
            if (cumulativePnL > maxPeak) {
                maxPeak = cumulativePnL;
            }
            const currentDrawdown = maxPeak - cumulativePnL;
            const currentDrawdownPercent = maxPeak > 0 ? (currentDrawdown / maxPeak) * 100 : 0;

            if (currentDrawdown > maxDrawdown) maxDrawdown = currentDrawdown;
            if (currentDrawdownPercent > maxDrawdownPercent) maxDrawdownPercent = currentDrawdownPercent;

            // Win/Loss Stats
            if (pnl > 0) {
                wins++;
                grossProfit += pnl;
                if (direction === 'long') longStats.wins++;
                else shortStats.wins++;
            } else if (pnl < 0) {
                losses++;
                grossLoss += Math.abs(pnl);
            } else {
                breakevens++;
            }

            // Directional Stats
            if (direction === 'long') {
                longStats.count++;
                longStats.pnl += pnl;
            } else {
                shortStats.count++;
                shortStats.pnl += pnl;
            }

            // Best/Worst
            if (pnl > bestTrade) bestTrade = pnl;
            if (pnl < worstTrade) worstTrade = pnl;

            // Curve Data
            pnlCurve.push({
                date: new Date(trade.created_at).toLocaleDateString(),
                pnl,
                cumulative: cumulativePnL,
                drawdown: currentDrawdownPercent
            });

            // Pair Stats
            const currentPair = pairMap.get(pair) || { count: 0, pnl: 0, wins: 0, grossProfit: 0, grossLoss: 0 };
            pairMap.set(pair, {
                count: currentPair.count + 1,
                pnl: currentPair.pnl + pnl,
                wins: currentPair.wins + (pnl > 0 ? 1 : 0),
                grossProfit: currentPair.grossProfit + (pnl > 0 ? pnl : 0),
                grossLoss: currentPair.grossLoss + (pnl < 0 ? Math.abs(pnl) : 0)
            });
        });

        const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
        const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;
        const avgWin = wins > 0 ? grossProfit / wins : 0;
        const avgLoss = losses > 0 ? grossLoss / losses : 0;
        const expectancy = (winRate / 100 * avgWin) - ((1 - winRate / 100) * avgLoss);

        const pairStats = Array.from(pairMap.entries()).map(([pair, stats]) => ({
            pair,
            count: stats.count,
            pnl: stats.pnl,
            winRate: (stats.wins / stats.count) * 100,
            profitFactor: stats.grossLoss > 0 ? stats.grossProfit / stats.grossLoss : stats.grossProfit > 0 ? Infinity : 0
        })).sort((a, b) => b.pnl - a.pnl);

        return {
            totalTrades,
            winRate,
            netPnL,
            profitFactor,
            wins,
            losses,
            breakevens,
            maxDrawdown,
            maxDrawdownPercent,
            avgWin,
            avgLoss,
            expectancy,
            bestTrade: bestTrade === -Infinity ? 0 : bestTrade,
            worstTrade: worstTrade === Infinity ? 0 : worstTrade,
            longStats: {
                count: longStats.count,
                pnl: longStats.pnl,
                winRate: longStats.count > 0 ? (longStats.wins / longStats.count) * 100 : 0
            },
            shortStats: {
                count: shortStats.count,
                pnl: shortStats.pnl,
                winRate: shortStats.count > 0 ? (shortStats.wins / shortStats.count) * 100 : 0
            },
            pnlCurve,
            pairStats
        };
    }, [links, startingBalance]);
};
