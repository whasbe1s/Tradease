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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="bg-nothing-surface/80 backdrop-blur-xl text-nothing-dark shadow-2xl flex items-center rounded-2xl border border-nothing-dark/10 h-14 px-2 pl-6">

                {/* Status */}
                <div className="flex items-center h-full mr-4">
                    <span className="font-mono font-bold text-xs tracking-widest uppercase">{selectedCount} Selected</span>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-nothing-dark/10 mx-2"></div>

                {/* Actions */}
                <div className="flex items-center gap-2 p-1">
                    <button
                        onClick={onBulkDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-[10px] font-bold font-mono uppercase tracking-wider transition-all rounded-xl border border-red-200"
                    >
                        <Trash2 size={14} /> Delete
                    </button>

                    <button
                        onClick={onClearSelection}
                        className="w-9 h-9 flex items-center justify-center hover:bg-nothing-dark/10 rounded-xl text-nothing-dark/40 hover:text-nothing-dark transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
