import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import { ShadowOverlay } from '../components/UI/ShadowOverlay';
import { Toast } from '../components/UI/Toast';
import { ToastItem } from '../types';

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
    return (
        <div className="min-h-screen text-nothing-dark pb-32 selection:bg-nothing-accent selection:text-white flex flex-col relative">
            <div className="fixed inset-0 z-0">
                <ShadowOverlay
                    className="absolute inset-0"
                    animation={{ scale: 100, speed: 40 }}
                    noise={{ opacity: 0.2, scale: 1.5 }}
                />
            </div>

            <div className="relative z-10 flex flex-col flex-grow w-full">
                <Header
                    onOpenTradeModal={onOpenTradeModal}
                />

                <main className="max-w-7xl mx-auto px-4 md:px-6 pt-26 flex-grow w-full">
                    <Outlet />
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
