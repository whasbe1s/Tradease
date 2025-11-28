import React, { useState, useEffect } from 'react';
import { Save, Settings, Wallet, Globe } from 'lucide-react';
import { AppSettings } from '../../types';
import { Dropdown } from '../UI/Dropdown';

interface SettingsContentProps {
    onSave: (settings: AppSettings) => void;
    initialSettings: AppSettings;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({ onSave, initialSettings }) => {
    const [balance, setBalance] = useState<string>(initialSettings.startingBalance.toString());
    const [currency, setCurrency] = useState<string>(initialSettings.currency);

    useEffect(() => {
        setBalance(initialSettings.startingBalance.toString());
        setCurrency(initialSettings.currency);
    }, [initialSettings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            startingBalance: parseFloat(balance) || 0,
            currency
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                className="w-full backdrop-blur-xl bg-nothing-base/40 border border-white/10 ring-1 ring-white/5 rounded-3xl p-8 shadow-2xl overflow-hidden relative"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-nothing-dark tracking-tight">Settings</h2>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40 mt-1">Application Configuration</p>
                    </div>
                    <div className="w-12 h-12 bg-nothing-dark/5 rounded-full flex items-center justify-center">
                        <Settings size={20} className="text-nothing-dark/60" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Starting Balance */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Wallet size={16} className="text-nothing-dark/40" />
                            <label className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40">Starting Balance</label>
                        </div>
                        <div className="relative group">
                            <input
                                type="number"
                                step="any"
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                                className="w-full bg-nothing-dark/5 border border-transparent rounded-xl px-4 py-4 font-mono text-xl focus:bg-white focus:text-nothing-base focus:border-nothing-dark/10 focus:outline-none focus:ring-4 focus:ring-nothing-dark/5 transition-all placeholder:text-nothing-dark/20"
                                placeholder="10000.00"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-nothing-dark/20 font-mono text-sm pointer-events-none">
                                {currency}
                            </div>
                        </div>
                        <p className="text-xs text-nothing-dark/40 pl-1">
                            This balance is used to calculate your total equity curve.
                        </p>
                    </div>

                    {/* Currency */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Globe size={16} className="text-nothing-dark/40" />
                            <label className="text-[10px] font-mono uppercase tracking-widest text-nothing-dark/40">Base Currency</label>
                        </div>
                        <div className="relative">
                            <Dropdown
                                value={currency}
                                onChange={(val) => setCurrency(val as string)}
                                options={[
                                    { value: 'USD', label: 'USD ($) - US Dollar' },
                                    { value: 'EUR', label: 'EUR (€) - Euro' },
                                    { value: 'GBP', label: 'GBP (£) - British Pound' },
                                    { value: 'JPY', label: 'JPY (¥) - Japanese Yen' }
                                ]}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-6 border-t border-nothing-dark/5">
                        <button
                            type="submit"
                            className="bg-nothing-dark text-nothing-base px-8 py-4 rounded-full font-mono font-bold uppercase tracking-wider hover:bg-nothing-dark/90 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3"
                        >
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                </form>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-nothing-dark/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            </div>
        </div>
    );
};
