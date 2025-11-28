import { useState, useEffect } from 'react';
import { EconomicEvent } from '../types';
import { fetchRealEvents } from '../services/economicCalendar';
import { useToast } from './useToast';

const CACHE_KEY = 'economic_calendar_cache';
const CACHE_METADATA_KEY = 'economic_calendar_metadata';

interface CacheMetadata {
    lastUpdated: string;
    weekStart: string;
}

export const useEconomicCalendar = () => {
    const [events, setEvents] = useState<EconomicEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    // Helper to get the Monday of the current week
    const getMonday = (d: Date) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(date.setDate(diff)).toISOString().split('T')[0];
    };

    const loadEvents = async (forceRefresh = false) => {
        setLoading(true);
        try {
            const currentMonday = getMonday(new Date());
            const cachedData = localStorage.getItem(CACHE_KEY);
            const cachedMetadataStr = localStorage.getItem(CACHE_METADATA_KEY);

            let shouldFetch = forceRefresh;

            if (!cachedData || !cachedMetadataStr) {
                shouldFetch = true;
            } else {
                const metadata: CacheMetadata = JSON.parse(cachedMetadataStr);
                // Check if we are in a new week
                if (metadata.weekStart !== currentMonday) {
                    console.log("New week detected. Refreshing calendar.");
                    shouldFetch = true;
                }
            }

            if (shouldFetch) {
                // Fetch fresh data
                const realEvents = await fetchRealEvents();
                if (realEvents.length > 0) {
                    setEvents(realEvents);

                    // Save to cache
                    localStorage.setItem(CACHE_KEY, JSON.stringify(realEvents));
                    localStorage.setItem(CACHE_METADATA_KEY, JSON.stringify({
                        lastUpdated: new Date().toISOString(),
                        weekStart: currentMonday
                    }));

                    if (forceRefresh) addToast("Calendar updated", "success");
                } else {
                    if (forceRefresh) addToast("Could not fetch live data", "error");
                }
            } else {
                // Load from cache
                if (cachedData) {
                    setEvents(JSON.parse(cachedData));
                    console.log("Loaded calendar from cache");
                }
            }
        } catch (error) {
            console.error("Failed to load calendar:", error);
            addToast("Error loading calendar", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    return {
        events,
        loading,
        refresh: () => loadEvents(true)
    };
};
