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
            className="w-full h-full backdrop-blur-xl bg-nothing-base/40 border border-white/10 ring-1 ring-white/5 rounded-3xl p-5 shadow-2xl flex flex-col relative overflow-hidden group"
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
            </div>
        </div>
    );
};
