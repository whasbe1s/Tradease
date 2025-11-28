import { useMemo } from 'react';

interface TradeValues {
    entry_price?: number;
    exit_price?: number;
    quantity?: number;
    fees?: number;
    stop_loss?: number;
    take_profit?: number;
    direction?: 'long' | 'short';
}

export const useTradeCalculations = (values: TradeValues) => {
    const { entry_price, exit_price, quantity, fees, stop_loss, take_profit, direction } = values;

    const rr = useMemo(() => {
        if (!entry_price || !stop_loss || !take_profit || entry_price === stop_loss) return null;
        const risk = Math.abs(entry_price - stop_loss);
        const reward = Math.abs(take_profit - entry_price);
        return parseFloat((reward / risk).toFixed(2));
    }, [entry_price, stop_loss, take_profit]);

    const pnl = useMemo(() => {
        if (!entry_price || !exit_price || !quantity) return null;
        let rawPnl = 0;
        if (direction === 'long') {
            rawPnl = (exit_price - entry_price) * quantity;
        } else {
            rawPnl = (entry_price - exit_price) * quantity;
        }
        return parseFloat((rawPnl - (fees || 0)).toFixed(2));
    }, [entry_price, exit_price, quantity, fees, direction]);

    return { rr, pnl };
};
