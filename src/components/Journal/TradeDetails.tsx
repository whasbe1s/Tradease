import React from 'react';
import { LinkItem } from '../../types';
import { Target, AlertCircle, Hash, FileText, Image as ImageIcon } from 'lucide-react';

interface TradeDetailsProps {
    trade: LinkItem;
}

export const TradeDetails: React.FC<TradeDetailsProps> = ({ trade }) => {
    // Calculate R:R if we have the data
    const calculateRR = () => {
        if (!trade.entry_price || !trade.exit_price || !trade.stop_loss) return null;
        const risk = Math.abs(trade.entry_price - trade.stop_loss);
        const reward = Math.abs(trade.exit_price - trade.entry_price);
        return risk > 0 ? (reward / risk).toFixed(2) : null;
    };

    const rr = calculateRR();

    return (
        <div className="px-6 py-6 border-t border-nothing-dark/5 bg-nothing-dark/[0.02]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Column: Trade Stats */}
                <div className="md:col-span-4 space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-nothing-dark/40 mb-4 pb-2 border-b border-nothing-dark/5">
                        <Hash size={10} />
                        Trade_Stats
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {trade.quantity && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-nothing-dark/40 font-mono uppercase tracking-wider">Quantity</span>
                                <span className="text-xs text-nothing-dark font-mono font-bold">{trade.quantity}</span>
                            </div>
                        )}

                        {trade.fees && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-nothing-dark/40 font-mono uppercase tracking-wider">Fees</span>
                                <span className="text-xs text-nothing-dark font-mono font-bold">${trade.fees}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 pt-2">
                        {trade.stop_loss && (
                            <div className="flex items-center justify-between p-2 rounded bg-nothing-dark/5 border border-nothing-dark/5">
                                <span className="text-[9px] text-nothing-dark/60 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                                    <AlertCircle size={10} />
                                    Stop_Loss
                                </span>
                                <span className="text-xs text-nothing-accent font-mono">${trade.stop_loss}</span>
                            </div>
                        )}

                        {trade.take_profit && (
                            <div className="flex items-center justify-between p-2 rounded bg-nothing-dark/5 border border-nothing-dark/5">
                                <span className="text-[9px] text-nothing-dark/60 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                                    <Target size={10} />
                                    Take_Profit
                                </span>
                                <span className="text-xs text-nothing-dark font-mono">${trade.take_profit}</span>
                            </div>
                        )}

                        {rr && (
                            <div className="flex items-center justify-between p-2 rounded bg-nothing-dark/5 border border-nothing-dark/5">
                                <span className="text-[9px] text-nothing-dark/60 font-mono uppercase tracking-wider">Risk:Reward</span>
                                <span className="text-xs text-nothing-dark font-mono font-bold">1:{rr}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Middle Column: Notes */}
                <div className="md:col-span-8 space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-nothing-dark/40 mb-4 pb-2 border-b border-nothing-dark/5">
                        <FileText size={10} />
                        Trade_Notes
                    </div>

                    <div className="min-h-[80px]">
                        {trade.notes ? (
                            <p className="text-xs text-nothing-dark/80 font-mono leading-relaxed whitespace-pre-wrap">
                                {trade.notes}
                            </p>
                        ) : (
                            <p className="text-xs text-nothing-dark/30 font-mono italic">
                                NO_NOTES_RECORDED
                            </p>
                        )}
                    </div>

                    {/* Tags */}
                    {trade.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {trade.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 bg-nothing-dark/5 border border-nothing-dark/10 rounded text-[9px] font-mono text-nothing-dark/60 uppercase tracking-wider"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Screenshot if available */}
                    {trade.screenshot_url && (
                        <div className="pt-4 mt-4 border-t border-nothing-dark/5">
                            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-nothing-dark/40 mb-3">
                                <ImageIcon size={10} />
                                Screenshot_Evidence
                            </div>
                            <div className="relative group overflow-hidden rounded-lg border border-nothing-dark/10 bg-nothing-dark/5">
                                <img
                                    src={trade.screenshot_url}
                                    alt="Trade screenshot"
                                    className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
