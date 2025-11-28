import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    includeTime?: boolean;
    className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    label,
    includeTime = true,
    className
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Helper to get local ISO string (YYYY-MM-DDTHH:mm)
    const toLocalISOString = (date: Date) => {
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
        return localISOTime;
    };

    // Parse initial date
    const dateObj = value ? new Date(value) : new Date();

    const [viewDate, setViewDate] = useState(dateObj);
    const [time, setTime] = useState(value ? value.split('T')[1]?.slice(0, 5) || '12:00' : '12:00');

    useEffect(() => {
        if (value) {
            const t = value.split('T')[1]?.slice(0, 5);
            if (t) setTime(t);

            const d = new Date(value);
            if (!isNaN(d.getTime())) {
                // Optional: sync view date? 
                // setViewDate(d);
            }
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const generateDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const days = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);

        const daysArray = [];
        for (let i = 0; i < firstDay; i++) {
            daysArray.push(null);
        }
        for (let i = 1; i <= days; i++) {
            daysArray.push(i);
        }
        return daysArray;
    };

    const handleDateClick = (day: number) => {
        // Construct new date string in local format YYYY-MM-DDTHH:mm
        const year = viewDate.getFullYear();
        const month = String(viewDate.getMonth() + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');

        const newDateString = `${year}-${month}-${d}T${time}`;
        onChange(newDateString);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        setTime(newTime);

        if (value) {
            const [datePart] = value.split('T');
            onChange(`${datePart}T${newTime}`);
        }
    };

    const changeMonth = (delta: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1));
    };

    const formatDisplayDate = (isoString: string) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        if (isNaN(d.getTime())) return '';
        return d.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: includeTime ? '2-digit' : undefined,
            minute: includeTime ? '2-digit' : undefined
        });
    };

    return (
        <div className={cn("relative group", className)} ref={containerRef}>
            {label && (
                <label className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2 group-focus-within:text-nothing-accent transition-colors">
                    {label}
                </label>
            )}
            <motion.button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full bg-nothing-dark/5 border border-transparent rounded-xl px-4 py-3",
                    "flex items-center justify-between",
                    "font-mono text-sm transition-all duration-300",
                    "hover:bg-nothing-dark/10",
                    isOpen && "bg-nothing-base border-nothing-dark/10 shadow-lg ring-4 ring-nothing-dark/5"
                )}
                whileTap={{ scale: 0.98 }}
            >
                <span className={cn("transition-colors", value ? 'text-nothing-dark' : 'text-nothing-dark/40')}>
                    {value ? formatDisplayDate(value) : 'Select Date...'}
                </span>
                <CalendarIcon size={16} className="text-nothing-dark/40" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 w-[280px] mt-2 bg-nothing-base/95 backdrop-blur-xl border border-nothing-dark/10 rounded-2xl shadow-2xl overflow-hidden p-3"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <button
                                type="button"
                                onClick={() => changeMonth(-1)}
                                className="p-1 hover:bg-nothing-dark/5 rounded-full transition-colors"
                            >
                                <ChevronLeft size={14} className="text-nothing-dark/60" />
                            </button>
                            <span className="font-mono font-bold text-sm text-nothing-dark">
                                {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </span>
                            <button
                                type="button"
                                onClick={() => changeMonth(1)}
                                className="p-1 hover:bg-nothing-dark/5 rounded-full transition-colors"
                            >
                                <ChevronRight size={14} className="text-nothing-dark/60" />
                            </button>
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-0.5 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                <div key={d} className="text-center text-[9px] font-mono text-nothing-dark/40 py-1">
                                    {d}
                                </div>
                            ))}
                            {generateDays().map((day, i) => {
                                if (day === null) return <div key={`empty-${i}`} />;

                                const currentDayDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                                const valueDate = value ? new Date(value) : null;
                                const isSelected = valueDate &&
                                    valueDate.getDate() === day &&
                                    valueDate.getMonth() === viewDate.getMonth() &&
                                    valueDate.getFullYear() === viewDate.getFullYear();

                                const isToday = new Date().toDateString() === currentDayDate.toDateString();

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => handleDateClick(day)}
                                        className={cn(
                                            "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-mono transition-all",
                                            isSelected
                                                ? "bg-nothing-accent text-nothing-base shadow-lg shadow-nothing-accent/20"
                                                : isToday
                                                    ? "bg-nothing-dark/10 text-nothing-dark font-bold border border-nothing-dark/20"
                                                    : "text-nothing-dark/80 hover:bg-nothing-dark/10"
                                        )}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Time Selector */}
                        {includeTime && (
                            <div className="border-t border-nothing-dark/10 pt-2 flex items-center gap-2">
                                <Clock size={12} className="text-nothing-dark/40" />
                                <input
                                    type="time"
                                    value={time}
                                    onChange={handleTimeChange}
                                    className="bg-transparent font-mono text-xs text-nothing-dark focus:outline-none w-full color-scheme-dark"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
