import React, { useState, useEffect } from 'react';

interface ClockProps {
    timezone?: string;
    label?: string;
    size?: 'large' | 'small';
}

export const Clock: React.FC<ClockProps> = ({ timezone, label, size = 'large' }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: size === 'large' ? '2-digit' : undefined,
            timeZone: timezone,
            hour12: false
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            timeZone: timezone
        });
    };

    if (size === 'small') {
        return (
            <div className="flex flex-col items-center justify-center text-nothing-dark select-none">
                <span className="text-xs uppercase tracking-[0.2em] opacity-60 mb-2 font-mono font-bold">{label || timezone}</span>
                <h2 className="text-2xl font-bold tracking-tight font-mono opacity-90">
                    {formatTime(time)}
                </h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center text-nothing-dark select-none">
            <h1 className="text-8xl md:text-[10rem] leading-none font-medium tracking-tighter font-mono">
                {formatTime(time)}
            </h1>
            <p className="text-lg md:text-xl font-mono tracking-widest opacity-40 mt-6 uppercase">
                {formatDate(time)}
            </p>
        </div>
    );
};
