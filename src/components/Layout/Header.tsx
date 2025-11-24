import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../Button';

interface HeaderProps {
    onAddClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddClick }) => {
    return (
        <header className="sticky top-0 z-40 backdrop-blur-md border-b border-nothing-dark/10 bg-nothing-base/80 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)]">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3 select-none">
                    <div className="w-8 h-8 bg-nothing-accent flex items-center justify-center text-white font-mono font-bold text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                        (L)
                    </div>
                    <h1 className="text-2xl font-bold font-mono tracking-tighter uppercase">Link(01)</h1>
                </div>

                <div className="flex items-center gap-4">
                    <Button onClick={onAddClick}>
                        <Plus size={18} className="mr-2" /> <span className="hidden sm:inline">Add Link</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};
