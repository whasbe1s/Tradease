import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface WinRateDonutProps {
    wins: number;
    losses: number;
    breakevens: number;
}

export const WinRateDonut: React.FC<WinRateDonutProps> = ({ wins, losses, breakevens }) => {
    const data = [
        { name: 'Wins', value: wins, color: 'var(--color-trade-win)' },
        { name: 'Losses', value: losses, color: 'var(--color-trade-loss)' },
        { name: 'Break Even', value: breakevens, color: 'var(--color-nothing-dim)' },
    ].filter(d => d.value > 0);

    const total = wins + losses + breakevens;
    const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';

    return (
        <div
            className="backdrop-blur-xl bg-glass border border-white/10 ring-1 ring-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden h-full min-h-[300px] flex flex-col"
        >
            <div className="mb-4">
                <div className="text-[10px] font-mono uppercase tracking-[0.5em] text-nothing-base/60">Win Rate</div>
            </div>

            <div className="flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#370617', borderColor: '#ffffff10', borderRadius: '8px', color: '#FFBA08' }}
                            itemStyle={{ color: '#FFBA08' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-light text-nothing-dark">{winRate}%</span>
                    <span className="text-[10px] font-mono uppercase text-nothing-dark/40 tracking-widest">Win Rate</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-trade-win"></div>
                    <span className="text-xs font-mono text-nothing-dark/60">{wins} W</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-trade-loss"></div>
                    <span className="text-xs font-mono text-nothing-dark/60">{losses} L</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-nothing-dim"></div>
                    <span className="text-xs font-mono text-nothing-dark/60">{breakevens} BE</span>
                </div>
            </div>
        </div>
    );
};
