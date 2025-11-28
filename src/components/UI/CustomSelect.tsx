import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
    color?: string; // Optional color for the label (e.g., green for Win)
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full bg-nothing-dark/5 border border-transparent rounded-xl px-4 py-3 
                    flex items-center justify-between
                    font-mono text-sm transition-all duration-200
                    focus:outline-none focus:bg-white focus:border-nothing-dark/10 focus:ring-4 focus:ring-nothing-dark/5
                    ${isOpen ? 'bg-white border-nothing-dark/10 ring-4 ring-nothing-dark/5' : ''}
                `}
            >
                <span className={`${selectedOption ? (selectedOption.color || 'text-nothing-dark') : 'text-nothing-dark/40'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-nothing-dark/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-xl border border-nothing-dark/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`
                                    w-full text-left px-3 py-2.5 rounded-lg font-mono text-sm flex items-center justify-between group transition-colors
                                    ${value === option.value ? 'bg-nothing-dark/5' : 'hover:bg-nothing-dark/5'}
                                `}
                            >
                                <span className={`${option.color || 'text-nothing-dark'} ${value === option.value ? 'font-bold' : ''}`}>
                                    {option.label}
                                </span>
                                {value === option.value && (
                                    <Check size={14} className="text-nothing-dark" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
