import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { LinkModal } from './components/Modals/LinkModal';
import { LinksProvider, useLinksContext } from './context/LinksContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useToast } from './hooks/useToast';
import { LinkItem, AppSettings } from './types';

// Lazy load pages
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const StatsPage = lazy(() => import('./pages/StatsPage').then(module => ({ default: module.StatsPage })));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage').then(module => ({ default: module.AnalysisPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const CalendarPage = lazy(() => import('./pages/CalendarPage').then(module => ({ default: module.CalendarPage })));
const TradeEntryPage = lazy(() => import('./pages/TradeEntryPage').then(module => ({ default: module.TradeEntryPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const DebugPage = lazy(() => import('./pages/DebugPage').then(module => ({ default: module.DebugPage })));

function AppContent() {
    const { toasts, addToast, removeToast } = useToast();
    const { searchQuery, setSearchQuery, updateLink, addLink } = useLinksContext();

    // Settings State
    const [appSettings, setAppSettings] = useState<AppSettings>(() => {
        const saved = localStorage.getItem('tradease_settings');
        return saved ? JSON.parse(saved) : { startingBalance: 10000, currency: 'USD' };
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

    const handleSaveSettings = (newSettings: AppSettings) => {
        setAppSettings(newSettings);
        localStorage.setItem('tradease_settings', JSON.stringify(newSettings));
        addToast("Settings saved.", 'success');
    };

    const handleSaveTrade = (trade: LinkItem) => {
        addLink(trade);
        addToast("Trade logged successfully.", 'success');
    };

    const handleEditLink = (link: LinkItem) => {
        setEditingLink(link);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingLink(null);
    };

    // Global keyboard shortcuts (Escape only, search is handled in Header)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Escape: Close modal or clear search
            if (e.key === 'Escape') {
                if (isModalOpen) {
                    handleCloseModal();
                } else if (searchQuery) {
                    setSearchQuery('');
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, searchQuery, setSearchQuery]);

    return (
        <Router>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen bg-nothing-base text-nothing-accent">
                    Loading...
                </div>
            }>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route element={
                        <ProtectedRoute>
                            <MainLayout
                                toasts={toasts}
                                removeToast={removeToast}
                                onOpenTradeModal={() => setIsTradeModalOpen(true)}
                            />
                        </ProtectedRoute>
                    }>
                        <Route path="/" element={<DashboardPage
                            handleEditLink={handleEditLink}
                        />} />
                        <Route path="/stats" element={<StatsPage startingBalance={appSettings.startingBalance} onEdit={handleEditLink} />} />
                        <Route path="/analysis" element={<AnalysisPage addToast={addToast} />} />
                        <Route path="/settings" element={<SettingsPage appSettings={appSettings} onSave={handleSaveSettings} />} />
                        <Route path="/calendar" element={<CalendarPage />} />
                        <Route path="/entry" element={<TradeEntryPage onSave={handleSaveTrade} />} />
                        <Route path="/entry" element={<TradeEntryPage onSave={handleSaveTrade} />} />
                        <Route path="/debug" element={<DebugPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </Suspense>

            <LinkModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUpdate={updateLink}
                linkData={editingLink}
            />
        </Router>
    );
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <LinksProvider>
                    <AppContent />
                </LinksProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}