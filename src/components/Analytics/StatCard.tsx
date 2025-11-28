import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon?: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    color?: string; // Tailwind text color class, e.g., 'text-green-500'
    bgGlow?: string; // Tailwind bg color class for glow, e.g., 'bg-green-500/5'
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon: Icon, trend, color = 'text-nothing-dark', bgGlow = 'bg-nothing-dark/5' }) => {
    return (
        <div
            className="backdrop-blur-xl bg-nothing-base/40 border border-white/10 ring-1 ring-white/5 rounded-3xl p-6 shadow-2xl flex flex-col items-start justify-between relative overflow-hidden group h-full min-h-[140px]"
        >
            <div className="flex justify-between w-full z-10">
                <span className="text-[10px] font-mono uppercase text-nothing-dark/40 tracking-[0.2em]">{label}</span>
                {Icon && <Icon size={16} className="text-nothing-dark/20 group-hover:text-nothing-dark/40 transition-colors" />}
            </div>

            <div className="z-10 mt-4">
                <span className={`text-3xl font-light tabular-nums ${color} block`}>
                    {value}
                </span>
                {subValue && (
                    <span className="text-xs font-mono text-nothing-dark/40 mt-1 block">
                        {subValue}
                    </span>
                )}
            </div>

            {/* Glow Effect */}
            <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-3xl transition-colors duration-500 opacity-50 group-hover:opacity-100 ${bgGlow}`}></div>
        </div>
    );
};
