import React from 'react';
import { SettingsContent } from '../components/Settings/SettingsContent';
import { AppSettings } from '../types';

interface SettingsPageProps {
    appSettings: AppSettings;
    onSave: (settings: AppSettings) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ appSettings, onSave }) => {
    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <SettingsContent initialSettings={appSettings} onSave={onSave} />
        </div>
    );
};
