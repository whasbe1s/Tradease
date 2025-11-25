import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

export const DailyFocus: React.FC = () => {
    const [focus, setFocus] = useState('');
    const [isSet, setIsSet] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const savedFocus = localStorage.getItem('dailyFocus');
        const savedDate = localStorage.getItem('dailyFocusDate');
        const savedCompleted = localStorage.getItem('dailyFocusCompleted');
        const today = new Date().toDateString();

        if (savedFocus && savedDate === today) {
            setFocus(savedFocus);
            setIsSet(true);
            setIsCompleted(savedCompleted === 'true');
        } else {
            // Reset if it's a new day
            localStorage.removeItem('dailyFocus');
            localStorage.removeItem('dailyFocusDate');
            localStorage.removeItem('dailyFocusCompleted');
        }
    }, []);

    const handleSetFocus = (e: React.FormEvent) => {
        e.preventDefault();
        if (focus.trim()) {
            setIsSet(true);
            localStorage.setItem('dailyFocus', focus);
            localStorage.setItem('dailyFocusDate', new Date().toDateString());
            localStorage.setItem('dailyFocusCompleted', 'false');
        }
    };

    const toggleComplete = () => {
        const newCompleted = !isCompleted;
        setIsCompleted(newCompleted);
        localStorage.setItem('dailyFocusCompleted', String(newCompleted));
    };

    const clearFocus = () => {
        setFocus('');
        setIsSet(false);
        setIsCompleted(false);
        localStorage.removeItem('dailyFocus');
        localStorage.removeItem('dailyFocusDate');
        localStorage.removeItem('dailyFocusCompleted');
    };

    if (isSet) {
        return (
            <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className="flex items-center gap-4 group">
                    <button
                        onClick={toggleComplete}
                        className={`w-6 h-6 rounded-full border transition-all duration-300 flex items-center justify-center ${isCompleted
                            ? 'bg-nothing-dark border-nothing-dark text-nothing-bg'
                            : 'border-nothing-dark/20 text-transparent hover:border-nothing-dark'
                            }`}
                    >
                        <Check size={14} />
                    </button>
                    <span
                        className={`text-2xl md:text-3xl font-light tracking-tight transition-all duration-300 ${isCompleted ? 'line-through text-nothing-dark/30' : 'text-nothing-dark'
                            }`}
                    >
                        {focus}
                    </span>
                    <button
                        onClick={clearFocus}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 text-nothing-dark/20 hover:text-nothing-dark hover:rotate-90"
                        title="Clear focus"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto animate-fade-in group flex flex-col items-center gap-2">
            <p className="text-sm uppercase tracking-widest text-nothing-dark/50 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-500">Today's Focus</p>
            <form onSubmit={handleSetFocus} className="relative w-full">
                <input
                    type="text"
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    placeholder="Main goal for today?"
                    className="w-full bg-transparent text-center text-xl md:text-2xl font-light py-2 focus:outline-none placeholder:text-nothing-dark/20 placeholder:font-light transition-all"
                    autoFocus
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-px bg-nothing-dark/10 group-focus-within:w-full group-focus-within:bg-nothing-dark/50 transition-all duration-500 ease-out"></div>
            </form>
        </div>
    );
};
