import React, { useState, useEffect } from 'react';
import { Save, TrendingUp, TrendingDown, Calculator, Tag, Sparkles, Wand2, Loader2 } from 'lucide-react';
import { Dropdown } from '../UI/Dropdown';
import { DatePicker } from '../UI/DatePicker';
import { TerminalItem, TradeDirection, TradeOutcome } from '../../types';
import { useNavigate } from 'react-router-dom';
import { TradeSchema } from '../../lib/validation';
import { useToast } from '../../hooks/useToast';
import { z } from 'zod';
import { parseTradeLog } from '../../services/geminiService';

interface TradeFormProps {
    onSave: (trade: TerminalItem) => void;
}

export const TradeForm: React.FC<TradeFormProps> = ({ onSave }) => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    // Quick Log State
    const [quickLogText, setQuickLogText] = useState('');
    const [isParsing, setIsParsing] = useState(false);

    // Form State
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

    const handleQuickLog = async () => {
        if (!quickLogText.trim()) return;

        setIsParsing(true);
        try {
            const data = await parseTradeLog(quickLogText);

            if (data.pair) setPair(data.pair);
            if (data.direction) setDirection(data.direction.toLowerCase() as TradeDirection);
            if (data.entry_price) setEntry(String(data.entry_price));
            if (data.exit_price) setExit(String(data.exit_price));
            if (data.stop_loss) setSl(String(data.stop_loss));
            if (data.take_profit) setTp(String(data.take_profit));
            if (data.quantity) setQuantity(String(data.quantity));
            if (data.outcome) setOutcome(data.outcome.toLowerCase() as TradeOutcome);
            if (data.notes) setNotes(data.notes);

            addToast('Trade data auto-filled!', 'success');
        } catch (error) {
            console.error("Quick Log Error:", error);
            addToast('Failed to parse trade log.', 'error');
        } finally {
            setIsParsing(false);
        }
    };

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
        <div className="w-full max-w-4xl mx-auto">
            <div
                className="w-full backdrop-blur-md border border-nothing-dark/10 rounded-3xl shadow-xl relative"
                style={{ backgroundColor: `rgba(67, 86, 99, var(--bento-opacity))` }}
            >
                {/* Background & Decor (Overflow Hidden Here) */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                </div>

                {/* Content (No Overflow Hidden) */}
                <div className="relative z-10 p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-nothing-dark tracking-tight">Log Trade</h2>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mt-1">New Journal Entry</p>
                        </div>
                        <div className="w-12 h-12 bg-nothing-dark/5 rounded-full flex items-center justify-center border border-nothing-dark/10">
                            <Tag size={20} className="text-nothing-dark/60" />
                        </div>
                    </div>

                    {/* Quick Log Section */}
                    <div className="mb-8 p-1 rounded-2xl bg-gradient-to-r from-nothing-accent/20 to-nothing-dark/10">
                        <div className="bg-nothing-base/90 rounded-xl p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles size={14} className="text-nothing-accent" />
                                <span className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/60">Quick Log AI</span>
                            </div>
                            <div className="relative">
                                <textarea
                                    value={quickLogText}
                                    onChange={(e) => setQuickLogText(e.target.value)}
                                    placeholder="e.g. Long BTC at 50k, SL 49k, TP 55k, risk 1%..."
                                    className="w-full bg-nothing-dark/5 border border-nothing-dark/10 rounded-xl p-3 pr-12 font-mono text-sm text-nothing-dark placeholder:text-nothing-dark/30 focus:bg-white focus:border-nothing-accent focus:outline-none transition-all resize-none h-20"
                                />
                                <button
                                    onClick={handleQuickLog}
                                    disabled={isParsing || !quickLogText.trim()}
                                    className="absolute bottom-3 right-3 p-2 rounded-lg bg-nothing-accent text-white hover:bg-nothing-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                                    title="Auto-fill form"
                                >
                                    {isParsing ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">

                        {/* Main Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column: Core Details */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Strategy Section */}
                                <div className="space-y-4">
                                    <div className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/30 border-b border-nothing-dark/10 pb-2">Strategy</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="group">
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Pair</label>
                                            <input
                                                value={pair}
                                                onChange={(e) => setPair(e.target.value)}
                                                placeholder="EURUSD"
                                                className="w-full bg-nothing-dark/5 border border-nothing-dark/10 rounded-xl px-4 py-3 font-mono text-lg text-nothing-dark uppercase placeholder:text-nothing-dark/20 focus:bg-white focus:border-nothing-accent focus:ring-4 focus:ring-nothing-accent/5 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-2 items-end">
                                            <button
                                                type="button"
                                                onClick={() => setDirection('long')}
                                                className={`flex-1 h-[54px] rounded-xl flex items-center justify-center gap-2 transition-all border ${direction === 'long'
                                                    ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20'
                                                    : 'bg-nothing-dark/5 text-nothing-dark/40 border-transparent hover:bg-nothing-dark/10 hover:text-nothing-dark'
                                                    }`}
                                            >
                                                <TrendingUp size={18} /> <span className="font-mono font-bold uppercase text-sm">Long</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDirection('short')}
                                                className={`flex-1 h-[54px] rounded-xl flex items-center justify-center gap-2 transition-all border ${direction === 'short'
                                                    ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20'
                                                    : 'bg-nothing-dark/5 text-nothing-dark/40 border-transparent hover:bg-nothing-dark/10 hover:text-nothing-dark'
                                                    }`}
                                            >
                                                <TrendingDown size={18} /> <span className="font-mono font-bold uppercase text-sm">Short</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Execution Section */}
                                <div className="space-y-4">
                                    <div className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/30 border-b border-nothing-dark/10 pb-2">Execution</div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="group">
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Entry</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={entry}
                                                onChange={(e) => setEntry(e.target.value)}
                                                className="w-full bg-nothing-dark/5 border border-nothing-dark/10 rounded-xl px-4 py-3 font-mono text-nothing-dark focus:bg-white focus:border-nothing-accent focus:ring-4 focus:ring-nothing-accent/5 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-red-500/60 mb-2">Stop Loss</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={sl}
                                                onChange={(e) => setSl(e.target.value)}
                                                className="w-full bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3 font-mono text-red-600 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-green-500/60 mb-2">Take Profit</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={tp}
                                                onChange={(e) => setTp(e.target.value)}
                                                className="w-full bg-green-500/5 border border-green-500/10 rounded-xl px-4 py-3 font-mono text-green-600 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="group">
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Quantity</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                className="w-full bg-nothing-dark/5 border border-nothing-dark/10 rounded-xl px-4 py-3 font-mono text-nothing-dark focus:bg-white focus:border-nothing-accent focus:ring-4 focus:ring-nothing-accent/5 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Exit Price</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={exit}
                                                onChange={(e) => setExit(e.target.value)}
                                                className="w-full bg-nothing-dark/5 border border-nothing-dark/10 rounded-xl px-4 py-3 font-mono text-nothing-dark focus:bg-white focus:border-nothing-accent focus:ring-4 focus:ring-nothing-accent/5 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-4">
                                    <div className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/30 border-b border-nothing-dark/10 pb-2">Notes</div>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={4}
                                        className="w-full bg-nothing-dark/5 border border-nothing-dark/10 rounded-xl p-4 font-mono text-sm text-nothing-dark focus:bg-white focus:border-nothing-accent focus:ring-4 focus:ring-nothing-accent/5 outline-none transition-all resize-none"
                                        placeholder="Trade rationale..."
                                    />
                                </div>

                            </div>

                            {/* Right Column: Outcome & Stats */}
                            <div className="space-y-8">

                                {/* Outcome Card */}
                                <div className="bg-nothing-dark/5 rounded-2xl p-6 border border-nothing-dark/10">
                                    <div className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-4">Outcome</div>
                                    <div className="space-y-4">
                                        <Dropdown
                                            label="Result"
                                            value={outcome}
                                            onChange={(val) => setOutcome(val as TradeOutcome)}
                                            options={[
                                                { value: 'pending', label: 'PENDING', color: 'text-nothing-dark/60' },
                                                { value: 'win', label: 'WIN', color: 'text-nothing-accent' },
                                                { value: 'loss', label: 'LOSS', color: 'text-red-500' },
                                                { value: 'be', label: 'BREAK EVEN', color: 'text-nothing-dark' }
                                            ]}
                                        />
                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Net PnL</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={pnl}
                                                onChange={(e) => setPnl(e.target.value)}
                                                placeholder="0.00"
                                                className={`w-full bg-white border border-nothing-dark/10 rounded-xl px-4 py-3 font-mono font-bold text-nothing-dark focus:border-nothing-accent focus:ring-4 focus:ring-nothing-accent/5 outline-none transition-all ${parseFloat(pnl) > 0 ? 'text-green-600' : parseFloat(pnl) < 0 ? 'text-red-600' : ''}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Card */}
                                <div className="bg-nothing-dark/5 rounded-2xl p-6 border border-nothing-dark/10">
                                    <div className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-4">Stats</div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-mono text-nothing-dark/60">Risk:Reward</span>
                                        {rr !== null ? (
                                            <span className={`text-sm font-bold font-mono ${rr >= 2 ? 'text-green-600' : 'text-nothing-dark'}`}>1:{rr}</span>
                                        ) : (
                                            <span className="text-xs font-mono text-nothing-dark/30">-</span>
                                        )}
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="space-y-4">
                                    <DatePicker
                                        label="Entry Date"
                                        value={entryDate}
                                        onChange={setEntryDate}
                                    />
                                    <DatePicker
                                        label="Exit Date"
                                        value={exitDate}
                                        onChange={setExitDate}
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end pt-6 border-t border-nothing-dark/10">
                            <button
                                type="submit"
                                className="bg-nothing-dark text-nothing-base px-8 py-4 rounded-full font-mono font-bold uppercase tracking-wider hover:bg-nothing-dark/90 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3"
                            >
                                <Save size={18} /> Save Trade
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
