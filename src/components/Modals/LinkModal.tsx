import React, { useState, useEffect, useRef } from 'react';
import { X, Save, TrendingUp, TrendingDown, Image as ImageIcon, Upload, Trash2 } from 'lucide-react';
import { LinkItem, TradeDirection, TradeOutcome } from '../../types';
import { Dropdown } from '../UI/Dropdown';
import { TagInput } from '../UI/TagInput';

interface LinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<LinkItem>) => void;
    linkData: LinkItem | null;
}

export const LinkModal: React.FC<LinkModalProps> = ({ isOpen, onClose, onUpdate, linkData }) => {
    const [pair, setPair] = useState('');
    const [direction, setDirection] = useState<TradeDirection>('long');
    const [outcome, setOutcome] = useState<TradeOutcome>('pending');
    const [entryPrice, setEntryPrice] = useState('');
    const [exitPrice, setExitPrice] = useState('');
    const [pnl, setPnl] = useState('');
    const [notes, setNotes] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && linkData) {
            setPair(linkData.pair || linkData.title || '');
            setDirection(linkData.direction || 'long');
            setOutcome(linkData.outcome || 'pending');
            setEntryPrice(linkData.entry_price?.toString() || '');
            setExitPrice(linkData.exit_price?.toString() || '');
            setPnl(linkData.pnl?.toString() || '');
            setNotes(linkData.notes || linkData.description || '');
            setTags(linkData.tags || []);
            setImage(linkData.screenshot_url || null);
        }
    }, [isOpen, linkData]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                if (blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImage(reader.result as string);
                    };
                    reader.readAsDataURL(blob);
                }
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!linkData) return;

        onUpdate(linkData.id, {
            pair: pair.toUpperCase(),
            title: `${direction.toUpperCase()} ${pair.toUpperCase()}`, // Keep title in sync
            direction,
            outcome,
            entry_price: entryPrice ? parseFloat(entryPrice) : undefined,
            exit_price: exitPrice ? parseFloat(exitPrice) : undefined,
            pnl: pnl ? parseFloat(pnl) : undefined,
            notes,
            description: notes, // Keep description in sync
            tags,
            screenshot_url: image || undefined
        });
        onClose();
    };

    if (!isOpen || !linkData) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-nothing-base/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div
                className="relative w-full max-w-4xl backdrop-blur-md border border-nothing-dark/5 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[90vh]"
                style={{ backgroundColor: `rgba(67, 86, 99, var(--bento-opacity))` }}
                onPaste={handlePaste}
            >
                {/* Left Side: Image Preview */}
                <div className="w-full md:w-2/5 bg-nothing-dark/5 border-r border-nothing-dark/5 p-6 flex flex-col justify-center items-center relative group">
                    {image ? (
                        <div className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden">
                            <img src={image} alt="Trade Screenshot" className="max-w-full max-h-full object-contain" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
                                    title="Change Image"
                                >
                                    <Upload size={20} />
                                </button>
                                <button
                                    onClick={() => setImage(null)}
                                    className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-200 backdrop-blur-md transition-colors"
                                    title="Remove Image"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-64 md:h-full border-2 border-dashed border-nothing-dark/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-nothing-dark/5 hover:border-nothing-dark/20 transition-all gap-4"
                        >
                            <div className="w-16 h-16 bg-nothing-dark/5 rounded-full flex items-center justify-center">
                                <ImageIcon size={24} className="text-nothing-dark/30" />
                            </div>
                            <p className="font-mono text-nothing-dark/40 uppercase tracking-widest text-xs text-center px-4">
                                Paste screenshot (Ctrl+V)<br />or click to upload
                            </p>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-3/5 p-8 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-nothing-dark tracking-tight">Edit Trade</h2>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mt-1">Modify Details</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-nothing-dark/5 flex items-center justify-center text-nothing-dark/60 hover:bg-nothing-dark/10 hover:text-nothing-dark transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Pair & Direction */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label htmlFor="trade-pair" className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Pair</label>
                                <input
                                    id="trade-pair"
                                    name="trade-pair"
                                    type="text"
                                    autoComplete="off"
                                    data-lpignore="true"
                                    value={pair}
                                    onChange={(e) => setPair(e.target.value)}
                                    className="w-full bg-nothing-dark/5 border border-transparent rounded-xl px-4 py-3 font-mono text-lg font-bold uppercase focus:bg-white focus:text-nothing-base focus:border-nothing-dark/10 focus:outline-none transition-all"
                                />
                            </div>
                            <div className="flex gap-2 items-end">
                                <button
                                    type="button"
                                    onClick={() => setDirection('long')}
                                    className={`flex-1 h-[52px] rounded-xl flex items-center justify-center gap-2 transition-all border ${direction === 'long'
                                        ? 'bg-green-500/10 text-green-600 border-green-500/20'
                                        : 'bg-nothing-dark/5 text-nothing-dark/40 border-transparent hover:bg-nothing-dark/10'
                                        }`}
                                >
                                    <TrendingUp size={16} /> <span className="font-mono text-xs uppercase font-bold">Long</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDirection('short')}
                                    className={`flex-1 h-[52px] rounded-xl flex items-center justify-center gap-2 transition-all border ${direction === 'short'
                                        ? 'bg-red-500/10 text-red-600 border-red-500/20'
                                        : 'bg-nothing-dark/5 text-nothing-dark/40 border-transparent hover:bg-nothing-dark/10'
                                        }`}
                                >
                                    <TrendingDown size={16} /> <span className="font-mono text-xs uppercase font-bold">Short</span>
                                </button>
                            </div>
                        </div>

                        {/* Price Levels */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label htmlFor="trade-entry" className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Entry Price</label>
                                <input
                                    id="trade-entry"
                                    name="trade-entry"
                                    type="number"
                                    step="any"
                                    autoComplete="off"
                                    data-lpignore="true"
                                    value={entryPrice}
                                    onChange={(e) => setEntryPrice(e.target.value)}
                                    className="w-full bg-nothing-dark/5 border border-transparent rounded-xl px-4 py-3 font-mono text-sm focus:bg-white focus:text-nothing-base focus:border-nothing-dark/10 focus:outline-none transition-all"
                                />
                            </div>
                            <div className="group">
                                <label htmlFor="trade-exit" className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Exit Price</label>
                                <input
                                    id="trade-exit"
                                    name="trade-exit"
                                    type="number"
                                    step="any"
                                    autoComplete="off"
                                    data-lpignore="true"
                                    value={exitPrice}
                                    onChange={(e) => setExitPrice(e.target.value)}
                                    className="w-full bg-nothing-dark/5 border border-transparent rounded-xl px-4 py-3 font-mono text-sm focus:bg-white focus:text-nothing-base focus:border-nothing-dark/10 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Outcome & PnL */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Outcome</label>
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Outcome</label>
                                <Dropdown
                                    value={outcome}
                                    onChange={(val) => setOutcome(val as TradeOutcome)}
                                    options={[
                                        { value: 'pending', label: 'Pending' },
                                        { value: 'win', label: 'Win', color: 'text-green-500' },
                                        { value: 'loss', label: 'Loss', color: 'text-red-500' },
                                        { value: 'be', label: 'Break Even' }
                                    ]}
                                />
                            </div>
                            <div className="group">
                                <label htmlFor="trade-pnl" className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Net PnL</label>
                                <input
                                    id="trade-pnl"
                                    name="trade-pnl"
                                    type="number"
                                    step="any"
                                    autoComplete="off"
                                    data-lpignore="true"
                                    value={pnl}
                                    onChange={(e) => setPnl(e.target.value)}
                                    className={`w-full bg-nothing-dark/5 border border-transparent rounded-xl px-4 py-3 font-mono text-sm font-bold focus:bg-white focus:text-nothing-base focus:border-nothing-dark/10 focus:outline-none transition-all ${parseFloat(pnl) > 0 ? 'text-green-600' : parseFloat(pnl) < 0 ? 'text-red-600' : ''}`}
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="group">
                            <label htmlFor="trade-notes" className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Notes</label>
                            <textarea
                                id="trade-notes"
                                name="trade-notes"
                                autoComplete="off"
                                data-lpignore="true"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full bg-nothing-dark/5 border border-transparent rounded-xl p-4 font-mono text-sm focus:bg-white focus:text-nothing-base focus:border-nothing-dark/10 focus:outline-none transition-all resize-none"
                                rows={4}
                                placeholder="Trade analysis..."
                            />
                        </div>

                        {/* Tags */}
                        <div className="group">
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Tags</label>
                            <TagInput
                                tags={tags}
                                onAddTag={(tag) => setTags([...tags, tag])}
                                onRemoveTag={(tag) => setTags(tags.filter(t => t !== tag))}
                            />
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-nothing-dark/5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 rounded-full font-mono text-xs uppercase tracking-wider text-nothing-dark/60 hover:bg-nothing-dark/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-nothing-dark text-nothing-base px-8 py-3 rounded-full font-mono font-bold uppercase tracking-wider hover:bg-nothing-dark/90 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                            >
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

