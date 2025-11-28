import React, { useState, useEffect } from 'react';
import { Save, TrendingUp, TrendingDown, Tag, Sparkles, Wand2, Loader2 } from 'lucide-react';
import { Dropdown } from '../UI/Dropdown';
import { DatePicker } from '../UI/DatePicker';
import { TerminalItem, TradeDirection, TradeOutcome } from '../../types';
import { useNavigate } from 'react-router-dom';
import { TradeSchema } from '../../lib/validation';
import { useToast } from '../../hooks/useToast';
import { z } from 'zod';
import { parseTradeLog } from '../../services/geminiService';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTradeCalculations } from '../../hooks/useTradeCalculations';

interface TradeFormProps {
    onSave: (trade: TerminalItem) => void;
}

type TradeFormData = z.infer<typeof TradeSchema>;

export const TradeForm: React.FC<TradeFormProps> = ({ onSave }) => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    // Quick Log State
    const [quickLogText, setQuickLogText] = useState('');
    const [isParsing, setIsParsing] = useState(false);

    // Initialize dates
    const initialEntryDate = (() => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        return new Date(now.getTime() - offset).toISOString().slice(0, 16);
    })();

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<TradeFormData>({
        resolver: zodResolver(TradeSchema),
        defaultValues: {
            direction: 'long',
            outcome: 'pending',
            quantity: 0,
            entry_price: 0,
            fees: 0,
        }
    });

    // Watch values for calculations
    const watchedValues = useWatch({ control });
    const { rr, pnl } = useTradeCalculations(watchedValues);

    // Dates are not part of the schema validation strictly in the same way, or maybe they should be?
    // The schema doesn't have entry_date/exit_date. They are added to the TerminalItem later.
    // We'll keep them as local state or add them to the form if we want validation.
    // For now, let's keep them as local state to match previous behavior, or better yet, use useForm for them too if we extend the schema.
    // The previous implementation had them separate. Let's keep them separate for now to minimize schema changes, 
    // but ideally they should be in the schema.
    const [entryDate, setEntryDate] = useState<string>(initialEntryDate);
    const [exitDate, setExitDate] = useState<string>('');

    // Update PnL in form when calculated
    useEffect(() => {
        if (pnl !== null) {
            setValue('pnl', pnl);
        }
    }, [pnl, setValue]);

    const handleQuickLog = async () => {
        if (!quickLogText.trim()) return;

        setIsParsing(true);
        try {
            const data = await parseTradeLog(quickLogText);

            if (data.pair) setValue('pair', data.pair);
            if (data.direction) setValue('direction', data.direction.toLowerCase() as TradeDirection);
            if (data.entry_price) setValue('entry_price', data.entry_price);
            if (data.exit_price) setValue('exit_price', data.exit_price);
            if (data.stop_loss) setValue('stop_loss', data.stop_loss);
            if (data.take_profit) setValue('take_profit', data.take_profit);
            if (data.quantity) setValue('quantity', data.quantity);
            if (data.outcome) setValue('outcome', data.outcome.toLowerCase() as TradeOutcome);
            if (data.notes) setValue('notes', data.notes);

            addToast('Trade data auto-filled!', 'success');
        } catch (error) {
            console.error("Quick Log Error:", error);
            addToast('Failed to parse trade log.', 'error');
        } finally {
            setIsParsing(false);
        }
    };

    const onSubmit = (data: TradeFormData) => {
        const newTrade: TerminalItem = {
            id: crypto.randomUUID(),
            url: '',
            title: `${data.direction.toUpperCase()} ${data.pair}`,
            description: data.notes || '',
            tags: [data.pair, 'trade', data.outcome],
            created_at: new Date().toISOString(),
            favorite: false,
            type: 'trade',
            ...data,
            entry_date: entryDate,
            exit_date: exitDate || undefined,
        };

        onSave(newTrade);
        navigate('/');
    };

    const onError = (errors: any) => {
        Object.values(errors).forEach((err: any) => {
            addToast(err.message, 'error');
        });
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

                    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8" autoComplete="off">

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
                                                {...register('pair')}
                                                placeholder="EURUSD"
                                                className="w-full bg-nothing-dark/5 border border-nothing-dark/10 rounded-xl px-4 py-3 font-mono text-lg text-nothing-dark uppercase placeholder:text-nothing-dark/20 focus:bg-white focus:border-nothing-accent focus:ring-4 focus:ring-nothing-accent/5 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="flex gap-2 items-end">
                                            <Controller
                                                name="direction"
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => field.onChange('long')}
                                                            className={`flex-1 h-[54px] rounded-xl flex items-center justify-center gap-2 transition-all border ${field.value === 'long'
                                                                ? 'bg-trade-win text-white border-trade-win shadow-lg shadow-trade-win/20'
                                                                : 'bg-nothing-dark/5 text-nothing-dark/40 border-transparent hover:bg-nothing-dark/10 hover:text-nothing-dark'
                                                                }`}
                                                        >
                                                            <TrendingUp size={18} /> <span className="font-mono font-bold uppercase text-sm">Long</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => field.onChange('short')}
                                                            className={`flex-1 h-[54px] rounded-xl flex items-center justify-center gap-2 transition-all border ${field.value === 'short'
                                                                ? 'bg-trade-loss text-white border-trade-loss shadow-lg shadow-trade-loss/20'
                                                                : 'bg-nothing-dark/5 text-nothing-dark/40 border-transparent hover:bg-nothing-dark/10 hover:text-nothing-dark'
                                                                }`}
                                                        >
                                                            <TrendingDown size={18} /> <span className="font-mono font-bold uppercase text-sm">Short</span>
                                                        </button>
                                                    </>
                                                )}
                                            />
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
                                                {...register('entry_price', { valueAsNumber: true })}
                                                className="w-full bg-nothing-dark/5 border border-nothing-dark/10 rounded-xl px-4 py-3 font-mono text-nothing-dark focus:bg-white focus:border-nothing-accent focus:ring-4 focus:ring-nothing-accent/5 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-trade-loss/60 mb-2">Stop Loss</label>
                                            <input
                                                type="number"
                                                step="any"
                                                {...register('stop_loss', { valueAsNumber: true })}
                                                className="w-full bg-trade-loss/5 border border-trade-loss/10 rounded-xl px-4 py-3 font-mono text-trade-loss focus:bg-white focus:border-trade-loss focus:ring-4 focus:ring-trade-loss/10 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-trade-win/60 mb-2">Take Profit</label>
                                            <input
                                                type="number"
                                                step="any"
                                                {...register('take_profit', { valueAsNumber: true })}
                                                className="w-full bg-trade-win/5 border border-trade-win/10 rounded-xl px-4 py-3 font-mono text-trade-win focus:bg-white focus:border-trade-win focus:ring-4 focus:ring-trade-win/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="group">
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Quantity</label>
                                            <input
                                                type="number"
                                                step="any"
                                                {...register('quantity', { valueAsNumber: true })}
                                                className="w-full bg-nothing-dark/5 border border-nothing-dark/10 rounded-xl px-4 py-3 font-mono text-nothing-dark focus:bg-white focus:border-nothing-accent focus:ring-4 focus:ring-nothing-accent/5 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Exit Price</label>
                                            <input
                                                type="number"
                                                step="any"
                                                {...register('exit_price', { valueAsNumber: true })}
                                                className="w-full bg-nothing-dark/5 border border-nothing-dark/10 rounded-xl px-4 py-3 font-mono text-nothing-dark focus:bg-white focus:border-nothing-accent focus:ring-4 focus:ring-nothing-accent/5 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-4">
                                    <div className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/30 border-b border-nothing-dark/10 pb-2">Notes</div>
                                    <textarea
                                        {...register('notes')}
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
                                        <Controller
                                            name="outcome"
                                            control={control}
                                            render={({ field }) => (
                                                <Dropdown
                                                    label="Result"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    options={[
                                                        { value: 'pending', label: 'PENDING', color: 'text-nothing-dark/60' },
                                                        { value: 'win', label: 'WIN', color: 'text-trade-win' },
                                                        { value: 'loss', label: 'LOSS', color: 'text-trade-loss' },
                                                        { value: 'be', label: 'BREAK EVEN', color: 'text-nothing-dark' }
                                                    ]}
                                                />
                                            )}
                                        />
                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mb-2">Net PnL</label>
                                            <input
                                                type="number"
                                                step="any"
                                                {...register('pnl', { valueAsNumber: true })}
                                                placeholder="0.00"
                                                className={`w-full bg-white border border-nothing-dark/10 rounded-xl px-4 py-3 font-mono font-bold text-nothing-dark focus:border-nothing-accent focus:ring-4 focus:ring-nothing-accent/5 outline-none transition-all ${pnl && pnl > 0 ? 'text-trade-win' : pnl && pnl < 0 ? 'text-trade-loss' : ''}`}
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
                                            <span className={`text-sm font-bold font-mono ${rr >= 2 ? 'text-trade-win' : 'text-nothing-dark'}`}>1:{rr}</span>
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
