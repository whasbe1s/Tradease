import React from 'react';
import { X, Trash2 } from 'lucide-react';

interface BulkActionBarProps {
    selectedCount: number;
    onClearSelection: () => void;
    onBulkDelete: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
    selectedCount,
    onClearSelection,
    onBulkDelete
}) => {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-200">
            <div className="bg-nothing-surface text-nothing-dark shadow-[4px_4px_0px_0px_rgba(109,35,35,0.2)] flex items-center rounded-none border border-nothing-dark/10 h-12 px-2">

                {/* Status */}
                <div className="flex items-center px-4 h-full">
                    <span className="font-mono font-bold text-sm tracking-wider">{selectedCount} SELECTED</span>
                </div>

                {/* Divider */}
                <div className="w-px h-4 bg-nothing-dark/20 mx-2"></div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={onBulkDelete}
                        className="flex items-center gap-2 px-3 py-1 hover:bg-nothing-accent/10 hover:text-nothing-accent text-xs font-mono uppercase transition-colors text-nothing-dark h-8 rounded-none"
                    >
                        <Trash2 size={14} /> Delete
                    </button>

                    <button
                        onClick={onClearSelection}
                        className="ml-2 w-8 h-8 flex items-center justify-center hover:bg-nothing-dark/5 rounded-none text-nothing-dark/50 hover:text-nothing-dark"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
