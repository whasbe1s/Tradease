import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, BarChart2, Settings, Search, Home, Calendar } from 'lucide-react';
import { Dock } from '../UI/Dock';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    onOpenTradeModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    onOpenTradeModal
}) => {
    const navigate = useNavigate();

    // Global keyboard shortcut for search (Removed for now, or could focus Journal search?)
    // For now, we'll remove it as per request to remove search from dock.

    return (
        <div className="fixed top-1/2 left-6 -translate-y-1/2 z-50 animate-fade-in-down w-auto flex items-center gap-4">
            {/* Main Dock Container */}
            <motion.div
                className={`
                    backdrop-blur-xl border border-nothing-dark/10 shadow-lg 
                    rounded-full px-2.5 py-3
                    flex flex-col items-center justify-between gap-2
                    hover:border-nothing-dark/30 hover:shadow-xl
                    z-20 relative
                `}
                style={{ backgroundColor: `rgba(67, 86, 99, var(--bento-opacity))` }}
            >
                <Dock
                    orientation="vertical"
                    items={[
                        {
                            label: 'Dashboard',
                            icon: Home,
                            onClick: () => navigate('/')
                        },
                        {
                            label: 'Analytics',
                            icon: BarChart2,
                            onClick: () => navigate('/stats')
                        },
                        {
                            label: 'Calendar',
                            icon: Calendar,
                            onClick: () => navigate('/calendar')
                        },
                        {
                            label: 'AI Analysis',
                            icon: Sparkles,
                            onClick: () => navigate('/analysis')
                        },
                        {
                            label: 'Settings',
                            icon: Settings,
                            onClick: () => navigate('/settings')
                        },
                        {
                            label: 'Log Trade',
                            icon: Plus,
                            onClick: () => navigate('/entry')
                        }
                    ]}
                />
            </motion.div>
        </div>
    );
};
