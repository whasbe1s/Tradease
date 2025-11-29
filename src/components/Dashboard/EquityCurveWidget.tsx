import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useTradeStats } from '../../hooks/useTradeStats';
import { LinkItem } from '../../types';

interface EquityCurveWidgetProps {
    links: LinkItem[];
}

export const EquityCurveWidget: React.FC<EquityCurveWidgetProps> = ({ links }) => {
    const stats = useTradeStats(links, 10000); // Default starting balance visual

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-nothing-base border border-nothing-dark/20 rounded-lg p-3 shadow-xl backdrop-blur-md">
                    <div className="text-[10px] font-mono text-nothing-dark/50 mb-1">Current Equity</div>
                    <div className={`font-mono font-bold text-sm ${payload[0].value >= 0 ? 'text-nothing-dark' : 'text-nothing-accent'}`}>
                        ${payload[0].value.toLocaleString()}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div
            className="w-full h-full backdrop-blur-xl bg-glass border border-white/10 ring-1 ring-white/5 rounded-3xl p-6 shadow-2xl flex flex-col relative overflow-hidden group"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2 z-10">
                <div className="flex flex-col">
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-nothing-dark/50">
                        Equity Curve
                    </div>
                    <div className="text-xs font-mono text-nothing-dark/30 mt-0.5">
                        Performance over time
                    </div>
                </div>
                <div className="p-2 rounded-full bg-nothing-dark/5 text-nothing-dark/40 group-hover:text-nothing-accent transition-colors">
                    <TrendingUp size={16} />
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 w-full min-h-0 -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.pnlCurve}>
                        <defs>
                            <linearGradient id="colorPnLWidget" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#E85D04" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#E85D04" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#435663', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="cumulative"
                            stroke="#E85D04"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPnLWidget)"
                            isAnimationActive={true}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Background Decoration - Dot Matrix */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#435663 1px, transparent 1px)',
                    backgroundSize: '12px 12px'
                }}
            ></div>
        </div>
    );
};
