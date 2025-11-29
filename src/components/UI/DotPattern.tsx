import React from 'react';
import { cn } from '../../lib/utils';

interface DotPatternProps {
    className?: string;
    opacity?: number;
}

export const DotPattern: React.FC<DotPatternProps> = ({
    className,
    opacity = 0.05
}) => {
    return (
        <div
            className={cn("absolute inset-0 pointer-events-none", className)}
            style={{
                opacity,
                backgroundImage: 'radial-gradient(#435663 1px, transparent 1px)',
                backgroundSize: '12px 12px'
            }}
        />
    );
};
