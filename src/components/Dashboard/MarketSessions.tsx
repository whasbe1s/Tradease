import React, { useState, useEffect } from 'react';

export const MarketSessions: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [timeToOpen, setTimeToOpen] = useState<string>('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);

            // Weekend Check (Friday > 22:00, Saturday, Sunday < 22:00)
            const day = now.getUTCDay();
            const hour = now.getUTCHours();
            const isWeekend = (day === 5 && hour >= 22) || day === 6 || (day === 0 && hour < 22);

            if (isWeekend) {
                // Calculate time to Monday 22:00 UTC (Sydney Open approx)
                // Actually Sydney opens around 21:00-22:00 UTC Sunday depending on DST, 
                // but usually Forex market "opens" Sunday 21:00/22:00 UTC.
                // Let's target Sunday 22:00 UTC for simplicity as "Market Open"

                const nextOpen = new Date(now);
                nextOpen.setUTCDate(now.getUTCDate() + ((7 - day) % 7)); // Move to Sunday
                if (day === 0 && now.getUTCHours() < 22) {
                    // It is Sunday, but before open
                    nextOpen.setUTCDate(now.getUTCDate());
                } else if (day === 0 && now.getUTCHours() >= 22) {
                    // Sunday after open, technically market is open, but let's handle "Weekend" as strictly Sat/Sun for now?
                    // Actually if it's Sunday > 22:00 UTC, market IS open.
                    // So isWeekend should be: Saturday (6) OR (Sunday (0) AND Hour < 22)
                }

                // Refined Weekend Logic:
                // Market closes Friday ~22:00 UTC
                // Market opens Sunday ~22:00 UTC

                // Simple check: Saturday is definitely closed. Sunday < 22:00 is closed. Friday > 22:00 is closed.

                let target = new Date(now);
                target.setUTCHours(22, 0, 0, 0);

                if (day === 5 && now.getUTCHours() >= 22) {
                    // Friday after close -> Target Sunday
                    target.setUTCDate(now.getUTCDate() + 2);
                } else if (day === 6) {
                    // Saturday -> Target Sunday
                    target.setUTCDate(now.getUTCDate() + 1);
                } else if (day === 0 && now.getUTCHours() < 22) {
                    // Sunday before open -> Target Today
                    target.setUTCDate(now.getUTCDate());
                } else {
                    // Market is open
                    setTimeToOpen('');
                    return;
                }

                const diff = target.getTime() - now.getTime();
                if (diff > 0) {
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    setTimeToOpen(`${hours}h ${minutes}m ${seconds}s`);
                } else {
                    setTimeToOpen('');
                }
            } else {
                setTimeToOpen('');
            }

        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const currentUtcHour = currentTime.getUTCHours() + (currentTime.getUTCMinutes() / 60);
    const day = currentTime.getUTCDay();
    // Market Closed if: Friday > 22:00, Saturday, Sunday < 22:00
    const isMarketClosed = (day === 5 && currentUtcHour >= 22) || day === 6 || (day === 0 && currentUtcHour < 22);

    const sessions = [
        { name: 'SYD', start: 22, end: 7, color: 'bg-nothing-dark' },
        { name: 'TKY', start: 0, end: 9, color: 'bg-nothing-dark' },
        { name: 'LDN', start: 8, end: 17, color: 'bg-nothing-accent' },
        { name: 'NYC', start: 13, end: 22, color: 'bg-nothing-accent' },
    ];

    const getPosition = (hour: number) => (hour / 24) * 100;

    const isSessionActive = (start: number, end: number, current: number) => {
        if (isMarketClosed) return false;
        if (start < end) {
            return current >= start && current < end;
        } else {
            return current >= start || current < end;
        }
    };

    return (
        <div
            className="w-full h-full backdrop-blur-xl bg-glass border border-white/10 ring-1 ring-white/5 rounded-3xl p-5 shadow-2xl flex flex-col relative overflow-hidden group"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-3 z-10">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-nothing-dark/50">
                    Market Sessions
                </div>
                <div className="text-[10px] font-mono text-nothing-dark/50">
                    UTC {currentTime.toISOString().substr(11, 5)}
                </div>
            </div>

            <div className="relative flex-grow flex flex-col justify-center gap-3 z-10">
                {isMarketClosed ? (
                    <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                        <div className="text-nothing-accent font-bold tracking-widest text-sm mb-2">MARKET CLOSED</div>
                        <div className="text-nothing-dark/60 text-xs font-mono">OPENS IN</div>
                        <div className="text-nothing-dark font-mono text-xl mt-1 tracking-wider">
                            {timeToOpen}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Sessions */}
                        {sessions.map((session, idx) => {
                            const isActive = isSessionActive(session.start, session.end, currentUtcHour);

                            return (
                                <div key={session.name} className="relative h-2 flex items-center w-full">
                                    {/* Label */}
                                    <div className="absolute -left-1 w-8 text-[9px] font-mono font-bold text-nothing-dark/40 z-20 pr-1">
                                        {session.name}
                                    </div>

                                    {/* Active Segment */}
                                    <div className="absolute left-8 right-0 h-full">
                                        {session.start < session.end ? (
                                            <div
                                                className={`absolute h-full rounded-full transition-all duration-500 ${isActive ? session.color : 'bg-nothing-dark/10'}`}
                                                style={{
                                                    left: `${getPosition(session.start)}%`,
                                                    width: `${getPosition(session.end - session.start)}%`,
                                                    opacity: isActive ? 0.8 : 0.3
                                                }}
                                            />
                                        ) : (
                                            <>
                                                <div
                                                    className={`absolute h-full rounded-l-full transition-all duration-500 ${isActive ? session.color : 'bg-nothing-dark/10'}`}
                                                    style={{
                                                        left: `${getPosition(session.start)}%`,
                                                        right: 0,
                                                        opacity: isActive ? 0.8 : 0.3
                                                    }}
                                                />
                                                <div
                                                    className={`absolute h-full rounded-r-full transition-all duration-500 ${isActive ? session.color : 'bg-nothing-dark/10'}`}
                                                    style={{
                                                        left: 0,
                                                        width: `${getPosition(session.end)}%`,
                                                        opacity: isActive ? 0.8 : 0.3
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Current Time Cursor */}
                        <div
                            className="absolute top-0 bottom-0 w-[1px] bg-nothing-accent/50 z-30 transition-all duration-1000"
                            style={{ left: `calc(2rem + ((100% - 2rem) * ${currentUtcHour / 24}))` }}
                        >
                            <div className="absolute -top-1 -left-[2px] w-1.5 h-1.5 bg-nothing-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(163,176,135,0.8)]" />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
