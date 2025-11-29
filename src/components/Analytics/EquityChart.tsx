import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface EquityChartProps {
    data: { date: string; cumulative: number }[];
}

export const EquityChart: React.FC<EquityChartProps> = ({ data }) => {
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
            className="w-full backdrop-blur-xl bg-glass border border-white/10 ring-1 ring-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden h-[400px] min-w-0"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.5em] text-nothing-base/60">Equity Curve</div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#E85D04" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#E85D04" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#ffffff20"
                            tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#ffffff60' }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={40}
                            dy={10}
                        />
                        <YAxis
                            stroke="#ffffff20"
                            tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#ffffff60' }}
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
                        <Area
                            type="monotone"
                            dataKey="cumulative"
                            stroke="#E85D04"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorEquity)"
                            activeDot={{ r: 6, fill: '#E85D04', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
