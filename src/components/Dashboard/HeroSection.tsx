import React from 'react';
import { Clock } from './Clock';
import { DailyFocus } from './DailyFocus';

export const HeroSection: React.FC = () => {
    return (
        <section className="flex flex-col items-center justify-center py-12 md:py-20 w-full animate-fade-in">
            <Clock />

            <div className="flex gap-16 mt-12 mb-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
                <Clock timezone="America/New_York" label="NYC" size="small" />
                <Clock timezone="Asia/Tokyo" label="TYO" size="small" />
            </div>

            <div className="flex flex-col items-center gap-6 mt-4">
                <DailyFocus />
            </div>
        </section>
    );
};
