import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipContextType {
    activeTooltip: string | null;
    setActiveTooltip: (id: string | null) => void;
    delayDuration: number;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export const TooltipProvider: React.FC<{ children: React.ReactNode; delayDuration?: number }> = ({
    children,
    delayDuration = 200
}) => {
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

    return (
        <TooltipContext.Provider value={{ activeTooltip, setActiveTooltip, delayDuration }}>
            {children}
        </TooltipContext.Provider>
    );
};

interface TooltipProps {
    children: React.ReactNode;
    id?: string; // Optional ID, otherwise we use random
}

export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
    return <div className="relative flex flex-col items-center">{children}</div>;
};

export const TooltipTrigger: React.FC<{ children: React.ReactNode; asChild?: boolean }> = ({ children }) => {
    return <>{children}</>;
};

export const TooltipContent: React.FC<{ children: React.ReactNode; side?: 'top' | 'bottom' | 'left' | 'right'; className?: string }> = ({
    children,
    side = 'top',
    className = ''
}) => {
    const positionClasses = {
        top: '-top-10 left-1/2 -translate-x-1/2',
        bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
        left: 'right-full mr-2 top-1/2 -translate-y-1/2',
        right: 'left-full ml-3 top-1/2 -translate-y-1/2'
    };

    return (
        <div className={`absolute ${positionClasses[side]} px-2 py-1 bg-nothing-base border border-nothing-dark/10 rounded text-[10px] font-mono uppercase tracking-wider text-nothing-dark shadow-xl whitespace-nowrap z-50 ${className}`}>
            {children}
        </div>
    );
};
