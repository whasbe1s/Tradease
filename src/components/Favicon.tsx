import React, { useState } from 'react';
import { Globe } from 'lucide-react';

interface FaviconProps {
    domain: string;
    size?: number;
    className?: string;
}

export const Favicon: React.FC<FaviconProps> = ({ domain, size = 32, className = '' }) => {
    const [error, setError] = useState(false);

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-nothing-dark/5 rounded-full ${className}`} style={{ width: size, height: size }}>
                <Globe size={size * 0.6} className="text-nothing-dark/30" />
            </div>
        );
    }

    return (
        <img
            src={faviconUrl}
            alt={`${domain} icon`}
            width={size}
            height={size}
            onError={() => setError(true)}
            className={`rounded-full ${className}`}
        />
    );
};
