import React, { useState, useEffect } from 'react';

export const MarketSessions: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const currentUtcHour = currentTime.getUTCHours() + (currentTime.getUTCMinutes() / 60);

    const sessions = [
        { name: 'SYD', start: 22, end: 7, color: 'bg-nothing-dark' },
        { name: 'TKY', start: 0, end: 9, color: 'bg-nothing-dark' },
        { name: 'LDN', start: 8, end: 17, color: 'bg-nothing-accent' },
        { name: 'NYC', start: 13, end: 22, color: 'bg-nothing-accent' },
    ];

    const getPosition = (hour: number) => (hour / 24) * 100;

    const isSessionActive = (start: number, end: number, current: number) => {
        if (start < end) {
            return current >= start && current < end;
        } else {
            return current >= start || current < end;
        }
    };

    return (
        <div
            className="w-full h-full backdrop-blur-md border border-nothing-dark/10 rounded-3xl p-5 shadow-xl flex flex-col relative overflow-hidden group bg-nothing-base/50"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 z-10">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-nothing-dark/50">
                    Market Sessions
                </div>
                <div className="text-[10px] font-mono text-nothing-dark/50">
                    UTC {currentTime.toISOString().substr(11, 5)}
                </div>
            </div>

            <div className="relative flex-grow flex flex-col justify-between z-10">
                {/* Time Grid Lines */}
                <div className="absolute inset-0 pointer-events-none">
                    {[0, 4, 8, 12, 16, 20, 24].map(h => (
                        <div
                            key={h}
                            className="absolute top-0 bottom-0 border-l border-nothing-dark/5"
                            style={{ left: `${getPosition(h)}%` }}
                        >
                            <span className="absolute -bottom-4 -left-2 text-[8px] font-mono text-nothing-dark/30">
                                {String(h).padStart(2, '0')}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Sessions */}
                <div className="flex flex-col gap-3 relative">
                    {sessions.map((session, idx) => {
                        const isActive = isSessionActive(session.start, session.end, currentUtcHour);

                        return (
                            <div key={session.name} className="relative h-4 flex items-center">
                                {/* Label */}
                                <div className="absolute -left-1 w-8 text-[9px] font-mono font-bold text-nothing-dark/60 z-20 bg-nothing-base/80 backdrop-blur-sm pr-1">
                                    {session.name}
                                </div>

                                {/* Track */}
                                <div className="absolute left-0 right-0 h-[2px] bg-nothing-dark/5 top-1/2 -translate-y-1/2" />

                                {/* Active Segment */}
                                <div className="absolute top-0 bottom-0 w-full h-full">
                                    {session.start < session.end ? (
                                        <div
                                            className={`absolute h-1.5 top-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${isActive ? session.color : 'bg-nothing-dark/20'}`}
                                            style={{
                                                left: `${getPosition(session.start)}%`,
                                                width: `${getPosition(session.end - session.start)}%`,
                                                opacity: isActive ? 1 : 0.5
                                            }}
                                        />
                                    ) : (
                                        <>
                                            <div
                                                className={`absolute h-1.5 top-1/2 -translate-y-1/2 rounded-l-full transition-all duration-500 ${isActive ? session.color : 'bg-nothing-dark/20'}`}
                                                style={{
                                                    left: `${getPosition(session.start)}%`,
                                                    right: 0,
                                                    opacity: isActive ? 1 : 0.5
                                                }}
                                            />
                                            <div
                                                className={`absolute h-1.5 top-1/2 -translate-y-1/2 rounded-r-full transition-all duration-500 ${isActive ? session.color : 'bg-nothing-dark/20'}`}
                                                style={{
                                                    left: 0,
                                                    width: `${getPosition(session.end)}%`,
                                                    opacity: isActive ? 1 : 0.5
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Current Time Cursor */}
                <div
                    className="absolute top-0 bottom-0 w-[1px] bg-nothing-accent z-30 transition-all duration-1000 shadow-[0_0_10px_rgba(163,176,135,0.5)]"
                    style={{ left: `${getPosition(currentUtcHour)}%` }}
                >
                    <div className="absolute -top-1 -left-[2px] w-1.5 h-1.5 bg-nothing-accent rounded-full animate-pulse" />
                </div>
            </div>

            {/* Background Decoration - Dot Matrix */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#435663 1px, transparent 1px)',
                    backgroundSize: '12px 12px'
                }}
            ></div>
        </div>
    );
};
