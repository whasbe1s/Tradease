import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-30 bg-nothing-base/80 backdrop-blur-md border-b border-nothing-dark/10">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                <h1 className="text-xl font-bold font-mono uppercase tracking-widest">
                    Link Library
                </h1>
            </div>
        </header>
    );
};
