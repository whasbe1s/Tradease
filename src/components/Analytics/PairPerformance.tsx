import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface PairPerformanceProps {
    data: { pair: string; pnl: number }[];
}

export const PairPerformance: React.FC<PairPerformanceProps> = ({ data }) => {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-nothing-surface/90 backdrop-blur border border-nothing-dark/10 rounded-lg p-3 text-xs font-mono shadow-xl">
                    <p className="text-nothing-dark/60 mb-1">{label}</p>
                    <p className={`font-bold text-sm ${payload[0].value >= 0 ? 'text-trade-win' : 'text-trade-loss'}`}>
                        ${payload[0].value.toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div
            className="backdrop-blur-xl bg-glass border border-white/10 ring-1 ring-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden h-full min-h-[300px] min-w-0"
        >
            <div className="mb-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.5em] text-nothing-base/60">Top Pairs</div>
            </div>
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
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
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? 'var(--color-trade-win)' : 'var(--color-trade-loss)'} />
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
    );
};
