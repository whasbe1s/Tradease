import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import FaultyTerminal from '../components/UI/FaultyTerminal';
import { Toast } from '../components/UI/Toast';
import { ToastItem } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

import { useTheme } from '../context/ThemeContext';

interface MainLayoutProps {
    children?: React.ReactNode;
    toasts: ToastItem[];
    removeToast: (id: string) => void;
    onOpenTradeModal: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    toasts,
    removeToast,
    onOpenTradeModal
}) => {
    const location = useLocation();
    const { backgroundSettings } = useTheme();

    return (
        <div className="min-h-screen text-nothing-dark selection:bg-nothing-accent selection:text-white flex flex-col relative">
            <div className="fixed inset-0 z-0">
                <FaultyTerminal
                    className="absolute inset-0"
                    tint="#FFBA08"
                    backgroundColor="#03071E"
                    scale={backgroundSettings.scale}
                    digitSize={1.4}
                    timeScale={0.8}
                    noiseAmp={backgroundSettings.noiseAmp}
                    brightness={backgroundSettings.brightness}
                    scanlineIntensity={backgroundSettings.scanlineIntensity}
                    curvature={0.22}
                    mouseStrength={0.5}
                    mouseReact={true}
                    pageLoadAnimation={false}
                />
            </div>

            <div className="relative z-10 flex flex-col flex-grow w-full">
                <Header
                    onOpenTradeModal={onOpenTradeModal}
                />

                <main className="max-w-7xl mx-auto px-4 md:px-6 pt-26 flex-grow w-full flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-full flex flex-col flex-grow"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Toast Container */}
                <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                    {toasts.map(toast => (
                        <Toast key={toast.id} toast={toast} onClose={removeToast} />
                    ))}
                </div>
            </div>
        </div>
    );
};
