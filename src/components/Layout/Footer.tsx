import React from 'react';
import { Download } from 'lucide-react';
import { LinkItem } from '../../types';

interface FooterProps {
    links: LinkItem[];
}

export const Footer: React.FC<FooterProps> = ({ links }) => {
    const handleExport = () => {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `links-export-${timestamp}.json`;
        const dataStr = JSON.stringify(links, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-nothing-base/80 backdrop-blur-sm border-t border-nothing-dark/10 z-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-12 flex items-center justify-between">
                <p className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/30">
                    ⌘K to search
                </p>

                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 text-xs font-mono uppercase text-nothing-dim hover:text-nothing-dark transition-colors"
                    title="Export all links to JSON"
                >
                    <Download size={14} />
                    Export
                </button>
            </div>
        </footer>
    );
};
