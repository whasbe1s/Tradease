import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 border-t border-nothing-dark/10 flex justify-between items-end text-nothing-dim">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono uppercase tracking-widest">System Ready</span>
                <span className="text-[10px] font-mono uppercase tracking-widest">V.1.0.0 // PUBLISH_BUILD</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest">&copy; {new Date().getFullYear()} Link(01) Library</span>
        </footer>
    );
};
