import React from 'react';
import { Download } from 'lucide-react';
import { LinkItem } from '../../types';

interface FooterProps {
    links: LinkItem[];
}

export const Footer: React.FC<FooterProps> = ({ links }) => {
    const handleExport = () => {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `tradease-backup-${timestamp}.json`;
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
        <footer className="fixed bottom-0 left-0 right-0 bg-nothing-base/80 backdrop-blur-md border-t border-nothing-dark/5 z-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40">

                {/* Left: Copyright & Version */}
                <div className="flex items-center gap-2">
                    <span>© 2024 Tradease</span>
                    <span className="opacity-30">//</span>
                    <span>v1.0.0</span>
                </div>

                {/* Center: System Status */}
                <div className="hidden md:flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Systems Operational</span>
                </div>

                {/* Right: Backup Action */}
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 hover:text-nothing-dark transition-colors group"
                    title="Download JSON Backup"
                >
                    <Download size={12} className="group-hover:translate-y-0.5 transition-transform" />
                    <span>Backup Data</span>
                </button>
            </div>
        </footer>
    );
};
