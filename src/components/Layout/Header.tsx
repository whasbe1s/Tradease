import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    const location = useLocation();

    // Global keyboard shortcut for search (Removed for now, or could focus Journal search?)
    // For now, we'll remove it as per request to remove search from dock.

    return (
        <div className={`
            fixed z-50 animate-fade-in-down w-auto flex items-center gap-4
            top-6 left-1/2 -translate-x-1/2
        `}>
            {/* Main Dock Container */}
            <Dock
                items={[
                    {
                        label: 'Dashboard',
                        icon: Home,
                        onClick: () => navigate('/'),
                        isActive: location.pathname === '/'
                    },
                    {
                        label: 'Analytics',
                        icon: BarChart2,
                        onClick: () => navigate('/stats'),
                        isActive: location.pathname === '/stats'
                    },
                    {
                        label: 'Calendar',
                        icon: Calendar,
                        onClick: () => navigate('/calendar'),
                        isActive: location.pathname === '/calendar'
                    },
                    {
                        label: 'AI Analysis',
                        icon: Sparkles,
                        onClick: () => navigate('/analysis'),
                        isActive: location.pathname === '/analysis'
                    },
                    {
                        label: 'Log Trade',
                        icon: Plus,
                        onClick: () => navigate('/entry'),
                        isActive: location.pathname === '/entry'
                    },
                    {
                        label: 'Settings',
                        icon: Settings,
                        onClick: () => navigate('/settings'),
                        isActive: location.pathname === '/settings'
                    }
                ]}
            />
        </div>
    );
};
