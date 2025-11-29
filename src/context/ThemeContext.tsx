import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BackgroundSettings {
    scale: number;
    scanlineIntensity: number;
    noiseAmp: number;
    brightness: number;
}

interface ThemeContextType {
    glassOpacity: number;
    setGlassOpacity: (opacity: number) => void;
    backgroundSettings: BackgroundSettings;
    setBackgroundSettings: (settings: BackgroundSettings) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultBackgroundSettings: BackgroundSettings = {
    scale: 3,
    scanlineIntensity: 1.3,
    noiseAmp: 1,
    brightness: 0.5
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize from localStorage or default to 0.4
    const [glassOpacity, setGlassOpacity] = useState<number>(() => {
        const saved = localStorage.getItem('glass_opacity');
        return saved ? parseFloat(saved) : 0.4;
    });

    const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>(() => {
        const saved = localStorage.getItem('background_settings');
        return saved ? JSON.parse(saved) : defaultBackgroundSettings;
    });

    useEffect(() => {
        // Update CSS variable
        document.documentElement.style.setProperty('--glass-opacity', glassOpacity.toString());
        // Save to localStorage
        localStorage.setItem('glass_opacity', glassOpacity.toString());
    }, [glassOpacity]);

    useEffect(() => {
        localStorage.setItem('background_settings', JSON.stringify(backgroundSettings));
    }, [backgroundSettings]);

    return (
        <ThemeContext.Provider value={{
            glassOpacity,
            setGlassOpacity,
            backgroundSettings,
            setBackgroundSettings
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
