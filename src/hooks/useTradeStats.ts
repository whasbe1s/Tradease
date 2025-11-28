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
    pnlCurve: { date: string; pnl: number; cumulative: number }[];
    pairStats: { pair: string; count: number; pnl: number; winRate: number }[];
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
                pnlCurve: [{ date: 'Start', pnl: 0, cumulative: startingBalance }],
                pairStats: []
            };
        }

        let wins = 0;
        let losses = 0;
        let breakevens = 0;
        let grossProfit = 0;
        let grossLoss = 0;
        let netPnL = 0;

        // Sort trades by date ascending for curve
        const sortedTrades = [...trades].sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        const pnlCurve: { date: string; pnl: number; cumulative: number }[] = [];
        // Initialize curve with starting balance
        pnlCurve.push({ date: 'Start', pnl: 0, cumulative: startingBalance });

        let cumulativePnL = startingBalance;

        const pairMap = new Map<string, { count: number; pnl: number; wins: number }>();

        sortedTrades.forEach(trade => {
            const pnl = Number(trade.pnl) || 0;
            const outcome = trade.outcome || 'BE';
            const pair = trade.pair || 'UNKNOWN';

            // Global Stats
            netPnL += pnl;
            cumulativePnL += pnl;

            if (pnl > 0) {
                wins++;
                grossProfit += pnl;
            } else if (pnl < 0) {
                losses++;
                grossLoss += Math.abs(pnl);
            } else {
                breakevens++;
            }

            // Curve Data
            pnlCurve.push({
                date: new Date(trade.created_at).toLocaleDateString(),
                pnl,
                cumulative: cumulativePnL
            });

            // Pair Stats
            const currentPair = pairMap.get(pair) || { count: 0, pnl: 0, wins: 0 };
            pairMap.set(pair, {
                count: currentPair.count + 1,
                pnl: currentPair.pnl + pnl,
                wins: currentPair.wins + (pnl > 0 ? 1 : 0)
            });
        });

        const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
        const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

        const pairStats = Array.from(pairMap.entries()).map(([pair, stats]) => ({
            pair,
            count: stats.count,
            pnl: stats.pnl,
            winRate: (stats.wins / stats.count) * 100
        })).sort((a, b) => b.pnl - a.pnl); // Sort by PnL descending

        return {
            totalTrades,
            winRate,
            netPnL,
            profitFactor,
            wins,
            losses,
            breakevens,
            pnlCurve,
            pairStats
        };
    }, [links, startingBalance]);
};
