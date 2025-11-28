import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant = 'default' | 'outline' | 'soft';
export type BadgeColor = 'accent' | 'success' | 'danger' | 'warning' | 'neutral' | 'info';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: BadgeVariant;
    color?: BadgeColor;
    children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    color = 'neutral',
    className,
    children,
    ...props
}) => {
    const colorStyles = {
        accent: {
            default: 'bg-nothing-accent text-white border-nothing-accent',
            outline: 'bg-transparent text-nothing-accent border-nothing-accent',
            soft: 'bg-nothing-accent/10 text-nothing-accent border-nothing-accent/20',
        },
        success: {
            default: 'bg-green-600 text-white border-green-600',
            outline: 'bg-transparent text-green-600 border-green-600',
            soft: 'bg-green-500/10 text-green-600 border-green-500/20',
        },
        danger: {
            default: 'bg-red-600 text-white border-red-600',
            outline: 'bg-transparent text-red-600 border-red-600',
            soft: 'bg-red-500/10 text-red-600 border-red-500/20',
        },
        warning: {
            default: 'bg-yellow-500 text-black border-yellow-500',
            outline: 'bg-transparent text-yellow-500 border-yellow-500',
            soft: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        },
        info: {
            default: 'bg-blue-500 text-white border-blue-500',
            outline: 'bg-transparent text-blue-500 border-blue-500',
            soft: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        },
        neutral: {
            default: 'bg-nothing-dark text-nothing-base border-nothing-dark',
            outline: 'bg-transparent text-nothing-dark border-nothing-dark/40',
            soft: 'bg-nothing-dark/10 text-nothing-dark border-nothing-dark/20',
        },
    };

    const styles = colorStyles[color][variant];

    return (
        <div
            className={cn(
                'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                styles,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
