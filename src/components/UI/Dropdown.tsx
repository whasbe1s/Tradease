import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DropdownOption {
    value: string;
    label: string;
    color?: string;
    icon?: React.ReactNode;
}

interface DropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: DropdownOption[];
    placeholder?: string;
    className?: string;
    label?: string;
    buttonClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    className,
    label,
    buttonClassName
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        if (e.key === 'Escape') {
            setIsOpen(false);
            return;
        }

        // Add more keyboard navigation logic here if needed (e.g. arrow keys to select options)
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
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={label || placeholder}
                className={cn(
                    "w-full bg-nothing-dark/5 border border-transparent rounded-xl px-4 py-3",
                    "flex items-center justify-between",
                    "font-mono text-sm transition-all duration-300",
                    "hover:bg-nothing-dark/10",
                    "focus:outline-none focus:ring-2 focus:ring-nothing-accent/50",
                    isOpen && "bg-nothing-base border-nothing-dark/10 shadow-lg ring-4 ring-nothing-dark/5",
                    buttonClassName
                )}
                whileTap={{ scale: 0.98 }}
            >
                <div className="flex items-center gap-2">
                    {selectedOption?.icon && (
                        <span className="text-nothing-dark/60">{selectedOption.icon}</span>
                    )}
                    <span className={cn(
                        "transition-colors",
                        selectedOption ? (selectedOption.color || 'text-nothing-dark') : 'text-nothing-dark/40'
                    )}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={16} className="text-nothing-dark/40" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-2 bg-nothing-base/95 backdrop-blur-xl border border-nothing-dark/10 rounded-xl shadow-2xl overflow-hidden"
                        role="listbox"
                    >
                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                            {options.map((option) => (
                                <motion.button
                                    key={option.value}
                                    type="button"
                                    role="option"
                                    aria-selected={value === option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-3 py-2.5 rounded-lg font-mono text-sm flex items-center justify-between group transition-all",
                                        "focus:outline-none focus:bg-nothing-dark/10",
                                        value === option.value ? "bg-nothing-dark/10" : "hover:bg-nothing-dark/5"
                                    )}
                                    whileHover={{ x: 4 }}
                                >
                                    <div className="flex items-center gap-2">
                                        {option.icon && (
                                            <span className="text-nothing-dark/40 group-hover:text-nothing-dark transition-colors">{option.icon}</span>
                                        )}
                                        <span className={cn(
                                            option.color || 'text-nothing-dark',
                                            value === option.value ? 'font-bold' : 'opacity-80 group-hover:opacity-100'
                                        )}>
                                            {option.label}
                                        </span>
                                    </div>
                                    {value === option.value && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <Check size={14} className="text-nothing-dark" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
