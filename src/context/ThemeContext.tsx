import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
    glassOpacity: number;
    setGlassOpacity: (opacity: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize from localStorage or default to 0.4
    const [glassOpacity, setGlassOpacity] = useState<number>(() => {
        const saved = localStorage.getItem('glass_opacity');
        return saved ? parseFloat(saved) : 0.4;
    });

    useEffect(() => {
        // Update CSS variable
        document.documentElement.style.setProperty('--glass-opacity', glassOpacity.toString());
        // Save to localStorage
        localStorage.setItem('glass_opacity', glassOpacity.toString());
    }, [glassOpacity]);

    return (
        <ThemeContext.Provider value={{ glassOpacity, setGlassOpacity }}>
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
