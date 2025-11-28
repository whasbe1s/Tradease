import React from 'react';
import { AIAnalysisContent } from '../components/Intelligence/AIAnalysisContent';

interface AnalysisPageProps {
    addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ addToast }) => {
    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <AIAnalysisContent addToast={addToast} />
        </div>
    );
};
