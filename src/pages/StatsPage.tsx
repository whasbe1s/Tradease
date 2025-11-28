import React from 'react';
import { StatsContent } from '../components/Analytics/StatsContent';
import { useTradeStats } from '../hooks/useTradeStats';
import { useLinksContext } from '../context/LinksContext';

import { JournalSection } from '../components/Journal/JournalSection';
import { LinkItem } from '../types';

interface StatsPageProps {
    startingBalance: number;
    onEdit?: (link: LinkItem) => void;
}

export const StatsPage: React.FC<StatsPageProps> = ({ startingBalance, onEdit }) => {
    const { links } = useLinksContext();
    const stats = useTradeStats(links, startingBalance);

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in space-y-8">
            <StatsContent stats={stats} />

            {/* Trade Journal Section */}
            <JournalSection onEdit={onEdit || (() => { })} />
        </div>
    );
};
