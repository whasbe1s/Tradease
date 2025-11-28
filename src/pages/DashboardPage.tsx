import React from 'react';
import { MarketSessions } from '../components/Dashboard/MarketSessions';
import { EconomicCalendar } from '../components/Dashboard/EconomicCalendar';
import { DailyStats } from '../components/Dashboard/DailyStats';
import { EquityCurveWidget } from '../components/Dashboard/EquityCurveWidget';
import { AIAnalysisWidget } from '../components/Dashboard/AIAnalysisWidget';
import { Footer } from '../components/Layout/Footer';
import { JournalSection } from '../components/Journal/JournalSection';
import { LinkItem } from '../types';
import { useLinksContext } from '../context/LinksContext';

interface DashboardPageProps {
    handleEditLink: (link: LinkItem) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
    handleEditLink
}) => {
    const { links } = useLinksContext();

    return (
        <>
            {/* Unified Bento Grid Layout - 3 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 animate-fade-in">

                {/* COLUMN 1: Performance Stats */}
                <div className="flex flex-col gap-4">
                    {/* Daily Stats (Win Rate, P&L) */}
                    <div className="h-[200px]">
                        <DailyStats links={links} />
                    </div>
                    {/* Equity Curve (Visual Progress) */}
                    <div className="h-[240px]">
                        <EquityCurveWidget links={links} />
                    </div>
                </div>

                {/* COLUMN 2: Market Context & AI */}
                <div className="flex flex-col gap-4">
                    {/* Market Sessions (Active Markets) */}
                    <div className="h-[140px]">
                        <MarketSessions />
                    </div>
                    {/* AI Analysis (Daily Outlook) */}
                    <div className="h-[300px]">
                        <AIAnalysisWidget />
                    </div>
                </div>

                {/* COLUMN 3: Planning */}
                <div className="lg:h-[456px]">
                    <EconomicCalendar />
                </div>

                {/* BOTTOM: Trade Journal (Full Width) */}
                <div className="lg:col-span-3">
                    <JournalSection onEdit={handleEditLink} />
                </div>
            </div>

            <Footer links={links} />
        </>
    );
};
