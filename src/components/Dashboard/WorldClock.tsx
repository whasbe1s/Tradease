import React, { useState, useEffect } from 'react';

export const WorldClock: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const currentUtcHour = currentTime.getUTCHours() + (currentTime.getUTCMinutes() / 60);

    // Session times in UTC
    // Tokyo: 00:00-09:00, London: 08:00-17:00, New York: 13:00-22:00, Sydney: 22:00-07:00
    const isTokyo = currentUtcHour >= 0 && currentUtcHour < 9;
    const isLondon = currentUtcHour >= 8 && currentUtcHour < 17;
    const isNewYork = currentUtcHour >= 13 && currentUtcHour < 22;
    const isSydney = currentUtcHour >= 22 || currentUtcHour < 7;

    // Determine overlaps
    const getActiveOverlap = () => {
        const active = [];
        if (isTokyo) active.push('TYO');
        if (isLondon) active.push('LON');
        if (isNewYork) active.push('NYC');
        if (isSydney) active.push('SYD');

        if (active.length > 1) {
            return active.join(' + ');
        }
        return null;
    };

    const overlapText = getActiveOverlap();
    const overlapCount = overlapText ? overlapText.split(' + ').length : 0;

    return (
        <div
            className="w-full h-full backdrop-blur-md border border-nothing-dark/5 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group"
            style={{ backgroundColor: `rgba(67, 86, 99, var(--bento-opacity))` }}
        >
            <div className="text-[10px] font-mono uppercase tracking-[0.5em] text-nothing-dark/40 mb-6 text-center">
                Universal Time
            </div>

            <div className="flex flex-col items-center">
                <div className="flex items-baseline gap-2 text-nothing-dark font-mono tabular-nums leading-none select-none">
                    <span className="text-6xl md:text-7xl font-light tracking-tighter drop-shadow-sm">
                        {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })}
                    </span>
                </div>
                <span className="text-xl font-light tracking-widest opacity-40 mt-2 font-mono">
                    {currentTime.toLocaleTimeString('en-US', { second: '2-digit', hour12: false, timeZone: 'UTC' }).padStart(2, '0')}
                </span>
            </div>

            {/* Session Overlap Indicator */}
            {overlapText && (
                <div className="mt-6 flex items-center gap-2 px-3 py-1 rounded-full bg-nothing-dark/5 border border-nothing-dark/5">
                    <div className="w-1.5 h-1.5 bg-nothing-dark/30 rounded-full"></div>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-nothing-dark/40">
                        {overlapText}
                    </span>
                </div>
            )}

            {/* Subtle background decoration */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-700"></div>
        </div>
    );
};
