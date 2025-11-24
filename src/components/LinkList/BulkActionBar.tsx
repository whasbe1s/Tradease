import React, { useState } from 'react';
import { X, Tag, Trash2 } from 'lucide-react';

interface BulkActionBarProps {
    selectedCount: number;
    onClearSelection: () => void;
    onBulkAction: (mode: 'add_tag' | 'remove_tag', tag: string) => void;
    onBulkDelete: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
    selectedCount,
    onClearSelection,
    onBulkAction,
    onBulkDelete
}) => {
    const [mode, setMode] = useState<'none' | 'add_tag' | 'remove_tag'>('none');
    const [input, setInput] = useState('');

    const handleAction = () => {
        if (mode !== 'none') {
            onBulkAction(mode, input);
            setMode('none');
            setInput('');
        }
    };

    return (
        <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto max-w-2xl z-40 animate-in slide-in-from-bottom-10 fade-in duration-200">
            <div className="bg-nothing-dark text-nothing-base p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] flex flex-col md:flex-row items-center gap-1 md:gap-0 rounded-none border border-nothing-base/20">

                {/* Status Section */}
                <div className="flex items-center justify-between w-full md:w-auto px-4 py-2 border-b md:border-b-0 md:border-r border-nothing-base/20 min-w-[120px]">
                    <span className="font-mono font-bold text-sm">{selectedCount} SELECTED</span>
                    <button onClick={onClearSelection} className="md:hidden text-nothing-base/50 hover:text-white">
                        <X size={16} />
                    </button>
                </div>

                {/* Actions Section */}
                {mode === 'none' ? (
                    <div className="flex items-center justify-center w-full md:w-auto p-1 gap-1">
                        <button
                            onClick={() => setMode('add_tag')}
                            className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2 hover:bg-nothing-base/10 text-xs font-mono uppercase transition-colors rounded-none"
                        >
                            <Tag size={14} /> + Tag
                        </button>
                        <button
                            onClick={() => setMode('remove_tag')}
                            className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2 hover:bg-nothing-base/10 text-xs font-mono uppercase transition-colors rounded-none"
                        >
                            <Tag size={14} /> - Tag
                        </button>
                        <div className="w-px h-4 bg-nothing-base/20 mx-2 hidden md:block" />
                        <button
                            onClick={onBulkDelete}
                            className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2 hover:bg-red-500/20 hover:text-red-400 text-xs font-mono uppercase transition-colors text-red-400 md:text-nothing-base rounded-none"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                        <button onClick={onClearSelection} className="hidden md:flex px-3 py-2 text-nothing-base/50 hover:text-white rounded-none">
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center w-full md:w-auto p-1 gap-2 animate-in fade-in duration-200">
                        <span className="font-mono text-xs uppercase px-2 text-nothing-base/60 whitespace-nowrap">
                            {mode === 'add_tag' ? 'ADD:' : 'REMOVE:'}
                        </span>
                        <input
                            autoFocus
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAction()}
                            className="bg-nothing-base/10 border-none text-white px-2 py-1 font-mono text-sm focus:ring-1 focus:ring-nothing-accent w-32 md:w-48 outline-none rounded-none"
                            placeholder="tag name..."
                        />
                        <button
                            onClick={handleAction}
                            className="px-3 py-1 bg-nothing-accent text-white font-mono text-xs uppercase hover:bg-orange-600 transition-colors rounded-none"
                        >
                            Apply
                        </button>
                        <button
                            onClick={() => {
                                setMode('none');
                                setInput('');
                            }}
                            className="px-2 py-1 hover:text-nothing-base/60 rounded-none"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
