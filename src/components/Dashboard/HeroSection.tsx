import React from 'react';
import { MarketSessions } from './MarketSessions';
import { EconomicCalendar } from './EconomicCalendar';

export const HeroSection: React.FC = () => {
    return (
        <section className="flex flex-col items-center justify-center py-8 md:py-12 w-full animate-fade-in">
            <MarketSessions />
            <EconomicCalendar />
        </section>
    );
};
