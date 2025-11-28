import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { StatsPage } from './pages/StatsPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { SettingsPage } from './pages/SettingsPage';
import { CalendarPage } from './pages/CalendarPage';
import { LinkModal } from './components/Modals/LinkModal';
import { TradeEntryPage } from './pages/TradeEntryPage';
import { LinksProvider, useLinksContext } from './context/LinksContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { useToast } from './hooks/useToast';
import { LinkItem, AppSettings } from './types';

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
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>

            <LinkModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUpdate={updateLink}
                linkData={editingLink}
            />
        </Router>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <LinksProvider>
                <AppContent />
            </LinksProvider>
        </AuthProvider>
    );
}