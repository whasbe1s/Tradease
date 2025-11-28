'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';

interface DockItem {
    icon: React.ComponentType<{ className?: string; size?: number }>;
    label: string;
    onClick?: () => void;
}

interface DockProps {
    className?: string;
    items: DockItem[];
    orientation?: 'horizontal' | 'vertical';
}

export const Dock: React.FC<DockProps> = ({ items, className, orientation = 'horizontal' }) => {
    const [active, setActive] = useState<string | null>(null);
    const [hovered, setHovered] = useState<number | null>(null);
    const isVertical = orientation === 'vertical';

    return (
        <div className={cn(
            "flex items-center justify-center",
            isVertical ? "h-full" : "w-full",
            className
        )}>
            <motion.div
                animate={{
                    y: isVertical ? 0 : [0, -6, 0],
                    x: 0
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                    "flex gap-3 px-4 py-4 rounded-full",
                    "border border-nothing-dark/10 bg-nothing-base/80 backdrop-blur-xl shadow-2xl",
                    isVertical ? "flex-col items-center" : "items-end"
                )}
                style={{
                    transform: isVertical
                        ? "perspective(800px) rotateY(-10deg)"
                        : "perspective(800px) rotateX(10deg)",
                }}
            >
                <TooltipProvider delayDuration={100}>
                    {items.map((item, i) => {
                        const isActive = active === item.label;
                        const isHovered = hovered === i;
                        const Icon = item.icon;

                        return (
                            <Tooltip key={item.label}>
                                <TooltipTrigger>
                                    <motion.div
                                        onMouseEnter={() => setHovered(i)}
                                        onMouseLeave={() => setHovered(null)}
                                        animate={{
                                            scale: isHovered ? 1.25 : 1,
                                            y: isVertical ? 0 : (isHovered ? -8 : 0),
                                            x: isVertical ? (isHovered ? 8 : 0) : 0,
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                        className="relative flex flex-col items-center"
                                    >
                                        <button
                                            className={cn(
                                                "relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                                                isActive ? "bg-nothing-dark/10" : "hover:bg-nothing-dark/5"
                                            )}
                                            onClick={() => {
                                                setActive(item.label);
                                                item.onClick?.();
                                            }}
                                        >
                                            <Icon
                                                size={24}
                                                className={cn(
                                                    "transition-colors duration-300",
                                                    isActive ? "text-nothing-accent" : "text-nothing-dark/60 group-hover:text-nothing-dark"
                                                )}
                                            />

                                            {/* Glowing ring effect on hover */}
                                            <AnimatePresence>
                                                {isHovered && (
                                                    <motion.span
                                                        layoutId="glow"
                                                        className="absolute inset-0 rounded-2xl border border-nothing-accent/30 shadow-[0_0_15px_rgba(163,176,135,0.3)]"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    />
                                                )}
                                            </AnimatePresence>
                                        </button>

                                        {/* Active indicator */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="dot"
                                                className={cn(
                                                    "absolute w-1.5 h-1.5 rounded-full bg-nothing-accent",
                                                    isVertical ? "-right-2 top-1/2 -translate-y-1/2" : "-bottom-2 left-1/2 -translate-x-1/2"
                                                )}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            />
                                        )}
                                    </motion.div>
                                </TooltipTrigger>
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, x: isVertical ? -10 : 0, y: isVertical ? 0 : 5 }}
                                            animate={{ opacity: 1, x: 0, y: 0 }}
                                            exit={{ opacity: 0, x: isVertical ? -10 : 0, y: isVertical ? 0 : 5 }}
                                        >
                                            <TooltipContent
                                                side={isVertical ? "right" : "top"}
                                                className="bg-nothing-surface border-nothing-dark/10 text-nothing-dark"
                                            >
                                                {item.label}
                                            </TooltipContent>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Tooltip>
                        );
                    })}
                </TooltipProvider>
            </motion.div>
        </div>
    );
};
