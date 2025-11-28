import React from 'react';
import { TradeForm } from '../components/Journal/TradeForm';
import { TerminalItem } from '../types';

interface TradeEntryPageProps {
    onSave: (trade: TerminalItem) => void;
}

export const TradeEntryPage: React.FC<TradeEntryPageProps> = ({ onSave }) => {
    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <TradeForm onSave={onSave} />
        </div>
    );
};
