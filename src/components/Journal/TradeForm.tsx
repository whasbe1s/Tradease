import React, { useState, useEffect } from 'react';
import { Save, TrendingUp, TrendingDown, Calculator, Tag } from 'lucide-react';
import { Dropdown } from '../UI/Dropdown';
import { DatePicker } from '../UI/DatePicker';
import { TerminalItem, TradeDirection, TradeOutcome } from '../../types';
import { useNavigate } from 'react-router-dom';
import { TradeSchema } from '../../lib/validation';
import { useToast } from '../../hooks/useToast';
import { z } from 'zod';

interface TradeFormProps {
    onSave: (trade: TerminalItem) => void;
}

export const TradeForm: React.FC<TradeFormProps> = ({ onSave }) => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [pair, setPair] = useState('');
    const [direction, setDirection] = useState<TradeDirection>('long');
    const [entry, setEntry] = useState<string>('');
    const [exit, setExit] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [fees, setFees] = useState<string>('');
    const [sl, setSl] = useState<string>('');
    const [tp, setTp] = useState<string>('');
    const [outcome, setOutcome] = useState<TradeOutcome>('pending');
    const [pnl, setPnl] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [screenshot, setScreenshot] = useState('');
    // Initialize with local ISO string
    const [entryDate, setEntryDate] = useState<string>(() => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        return new Date(now.getTime() - offset).toISOString().slice(0, 16);
    });
    const [exitDate, setExitDate] = useState<string>('');
    const [rr, setRr] = useState<number | null>(null);

    // Calculate R:R whenever Entry, SL, or TP changes
    useEffect(() => {
        const e = parseFloat(entry);
        const s = parseFloat(sl);
        const t = parseFloat(tp);

        if (!isNaN(e) && !isNaN(s) && !isNaN(t) && e !== s) {
            const risk = Math.abs(e - s);
            const reward = Math.abs(t - e);
            setRr(parseFloat((reward / risk).toFixed(2)));
        } else {
            setRr(null);
        }
    }, [entry, sl, tp]);

    // Auto-calculate PnL if Exit Price, Entry Price, and Quantity are present
    useEffect(() => {
        const e = parseFloat(entry);
        const x = parseFloat(exit);
        const q = parseFloat(quantity);
        const f = parseFloat(fees) || 0;

        if (!isNaN(e) && !isNaN(x) && !isNaN(q)) {
            let rawPnl = 0;
            if (direction === 'long') {
                rawPnl = (x - e) * q;
            } else {
                rawPnl = (e - x) * q;
            }
            setPnl((rawPnl - f).toFixed(2));
        }
    }, [entry, exit, quantity, fees, direction]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const validatedData = TradeSchema.parse({
                pair,
                direction,
                entry_price: parseFloat(entry),
                exit_price: exit ? parseFloat(exit) : undefined,
                quantity: parseFloat(quantity),
                fees: fees ? parseFloat(fees) : undefined,
                stop_loss: sl ? parseFloat(sl) : undefined,
                take_profit: tp ? parseFloat(tp) : undefined,
                outcome,
                pnl: pnl ? parseFloat(pnl) : undefined,
                notes,
                screenshot_url: screenshot || undefined,
            });

            const newTrade: TerminalItem = {
                id: crypto.randomUUID(),
                url: '',
                title: `${validatedData.direction.toUpperCase()} ${validatedData.pair}`,
                description: validatedData.notes || '',
                tags: [validatedData.pair, 'trade', validatedData.outcome],
                created_at: new Date().toISOString(),
                favorite: false,
                type: 'trade',
                ...validatedData,
                entry_date: entryDate,
                exit_date: exitDate || undefined,
            };

            onSave(newTrade);
            navigate('/');
        } catch (error) {
            if (error instanceof z.ZodError) {
                (error as z.ZodError).issues.forEach(err => {
                    addToast(`${err.path.join('.')}: ${err.message}`, 'error');
                });
            } else {
                addToast('Failed to save trade', 'error');
            }
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div
                className="w-full backdrop-blur-md border border-nothing-dark/5 rounded-3xl p-8 shadow-xl overflow-hidden relative"
                style={{ backgroundColor: `rgba(67, 86, 99, var(--bento-opacity))` }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-nothing-dark tracking-tight">Log Trade</h2>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mt-1">New Journal Entry</p>
                    </div>
                    <div className="w-12 h-12 bg-nothing-dark/5 rounded-full flex items-center justify-center">
                        <Tag size={20} className="text-nothing-dark/60" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">

                    {/* Section 1: Core Trade Info */}
                    <div className="space-y-4">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/30 border-b border-nothing-dark/5 pb-2 mb-4">Core Details</div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="group">
                                <label htmlFor="pair" className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2 group-focus-within:text-nothing-accent transition-colors">Pair</label>
                                <input
                                    id="pair"
                                    name="pair"
                                    type="text"
                                    value={pair}
                                    onChange={(e) => setPair(e.target.value)}
                                    placeholder="EURUSD"
                                    className="w-full bg-white/50 border border-nothing-dark/10 rounded-xl px-4 py-3 font-mono text-lg text-nothing-dark placeholder:text-nothing-dark/20 focus:bg-white focus:border-nothing-dark/30 focus:outline-none focus:ring-4 focus:ring-nothing-dark/5 transition-all uppercase shadow-sm"
                                    autoFocus
                                    autoComplete="off"
                                    data-lpignore="true"
                                    required
                                />
                            </div>

                            <div className="flex gap-2 items-end">
                                <button
                                    type="button"
                                    onClick={() => setDirection('long')}
                                    className={`flex-1 h-[54px] rounded-xl flex items-center justify-center gap-2 transition-all duration-300 border ${direction === 'long'
                                        ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20'
                                        : 'bg-nothing-dark/5 text-nothing-dark/40 border-transparent hover:bg-nothing-dark/10'
                                        }`}
                                >
                                    <TrendingUp size={18} /> <span className="font-mono font-bold uppercase tracking-wider text-sm">Long</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDirection('short')}
                                    className={`flex-1 h-[54px] rounded-xl flex items-center justify-center gap-2 transition-all duration-300 border ${direction === 'short'
                                        ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20'
                                        : 'bg-nothing-dark/5 text-nothing-dark/40 border-transparent hover:bg-nothing-dark/10'
                                        }`}
                                >
                                    <TrendingDown size={18} /> <span className="font-mono font-bold uppercase tracking-wider text-sm">Short</span>
                                </button>
                            </div>

                            <div className="group">
                                <label htmlFor="quantity" className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2 group-focus-within:text-nothing-accent transition-colors">Quantity</label>
                                <div className="relative">
                                    <input
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        step="any"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="1.0"
                                        className="w-full bg-white/50 border border-nothing-dark/10 rounded-xl px-4 py-3 font-mono text-nothing-dark placeholder:text-nothing-dark/20 focus:bg-white focus:border-nothing-dark/30 focus:outline-none focus:ring-4 focus:ring-nothing-dark/5 transition-all shadow-sm"
                                        autoComplete="off"
                                        data-lpignore="true"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Price Levels */}
                    <div className="space-y-4">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/30 border-b border-nothing-dark/5 pb-2 mb-4">Price Levels</div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="group">
                                <label htmlFor="entry" className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2 group-focus-within:text-nothing-accent transition-colors">Entry Price</label>
                                <input
                                    id="entry"
                                    name="entry"
                                    type="number"
                                    step="any"
                                    value={entry}
                                    onChange={(e) => setEntry(e.target.value)}
                                    className="w-full bg-white/50 border border-nothing-dark/10 rounded-xl px-4 py-3 font-mono text-nothing-dark focus:bg-white focus:border-nothing-dark/30 focus:outline-none focus:ring-4 focus:ring-nothing-dark/5 transition-all shadow-sm"
                                    autoComplete="off"
                                    data-lpignore="true"
                                    required
                                />
                            </div>
                            <div className="group">
                                <label htmlFor="exit" className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2 group-focus-within:text-nothing-accent transition-colors">Exit Price</label>
                                <input
                                    id="exit"
                                    name="exit"
                                    type="number"
                                    step="any"
                                    value={exit}
                                    onChange={(e) => setExit(e.target.value)}
                                    className="w-full bg-white/50 border border-nothing-dark/10 rounded-xl px-4 py-3 font-mono text-nothing-dark focus:bg-white focus:border-nothing-dark/30 focus:outline-none focus:ring-4 focus:ring-nothing-dark/5 transition-all shadow-sm"
                                    autoComplete="off"
                                    data-lpignore="true"
                                />
                            </div>
                            <div className="group">
                                <label htmlFor="sl" className="block text-[10px] font-mono uppercase tracking-widest text-red-500/60 mb-2 group-focus-within:text-red-500 transition-colors">Stop Loss</label>
                                <input
                                    id="sl"
                                    name="sl"
                                    type="number"
                                    step="any"
                                    value={sl}
                                    onChange={(e) => setSl(e.target.value)}
                                    className="w-full bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3 font-mono text-red-600 focus:bg-white focus:border-red-200 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all shadow-sm"
                                    autoComplete="off"
                                    data-lpignore="true"
                                />
                            </div>
                            <div className="group">
                                <label htmlFor="tp" className="block text-[10px] font-mono uppercase tracking-widest text-green-500/60 mb-2 group-focus-within:text-green-500 transition-colors">Take Profit</label>
                                <input
                                    id="tp"
                                    name="tp"
                                    type="number"
                                    step="any"
                                    value={tp}
                                    onChange={(e) => setTp(e.target.value)}
                                    className="w-full bg-green-500/5 border border-green-500/10 rounded-xl px-4 py-3 font-mono text-green-600 focus:bg-white focus:border-green-200 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all shadow-sm"
                                    autoComplete="off"
                                    data-lpignore="true"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Time & Outcome */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/30 border-b border-nothing-dark/5 pb-2 mb-4">Timing</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <DatePicker
                                        label="Entry Date"
                                        value={entryDate}
                                        onChange={setEntryDate}
                                    />
                                </div>
                                <div>
                                    <DatePicker
                                        label="Exit Date"
                                        value={exitDate}
                                        onChange={setExitDate}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/30 border-b border-nothing-dark/5 pb-2 mb-4">Result</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Dropdown
                                        label="Outcome"
                                        value={outcome}
                                        onChange={(val) => setOutcome(val as TradeOutcome)}
                                        options={[
                                            { value: 'pending', label: 'PENDING', color: 'text-nothing-dark/60' },
                                            { value: 'win', label: 'WIN', color: 'text-nothing-accent' },
                                            { value: 'loss', label: 'LOSS', color: 'text-red-500' },
                                            { value: 'be', label: 'BREAK EVEN', color: 'text-nothing-dark' }
                                        ]}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="pnl" className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Net PnL</label>
                                    <input
                                        id="pnl"
                                        name="pnl"
                                        type="number"
                                        step="any"
                                        value={pnl}
                                        onChange={(e) => setPnl(e.target.value)}
                                        placeholder="0.00"
                                        className={`w-full bg-white/50 border border-nothing-dark/10 rounded-xl px-4 py-3 font-mono font-bold text-nothing-dark focus:bg-white focus:border-nothing-dark/30 focus:outline-none focus:ring-4 focus:ring-nothing-dark/5 transition-all shadow-sm ${parseFloat(pnl) > 0 ? 'text-green-600' : parseFloat(pnl) < 0 ? 'text-red-600' : ''}`}
                                        autoComplete="off"
                                        data-lpignore="true"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Analysis */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end border-b border-nothing-dark/5 pb-2 mb-4">
                            <div className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/30">Analysis</div>
                            {rr !== null && (
                                <div className="flex items-center gap-2 bg-nothing-dark/5 px-3 py-1 rounded-full">
                                    <Calculator size={12} className="text-nothing-dark/40" />
                                    <span className="text-[10px] font-mono text-nothing-dark/60">R:R</span>
                                    <span className={`text-xs font-bold font-mono ${rr >= 2 ? 'text-green-600' : 'text-nothing-dark'}`}>1:{rr}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <textarea
                                id="notes"
                                name="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                className="w-full bg-white/50 border border-nothing-dark/10 rounded-xl p-4 font-mono text-sm text-nothing-dark focus:bg-white focus:border-nothing-dark/30 focus:outline-none focus:ring-4 focus:ring-nothing-dark/5 transition-all resize-none shadow-sm"
                                placeholder="Strategy, emotions, market context..."
                                autoComplete="off"
                                data-lpignore="true"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-6 border-t border-nothing-dark/5">
                        <button
                            type="submit"
                            className="bg-nothing-dark text-nothing-base px-8 py-4 rounded-full font-mono font-bold uppercase tracking-wider hover:bg-nothing-dark/90 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3"
                        >
                            <Save size={18} /> Save Trade
                        </button>
                    </div>
                </form>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-nothing-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            </div>
        </div>
    );
};
