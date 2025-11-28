import { EconomicEvent, Currency, EconomicImpact } from '../types';

// Common economic events that occur regularly
const economicEventTemplates = [
    { event: 'Non-Farm Payrolls', currency: 'USD' as Currency, impact: 'high' as EconomicImpact, time: '13:30' },
    { event: 'CPI m/m', currency: 'USD' as Currency, impact: 'high' as EconomicImpact, time: '13:30' },
    { event: 'Core CPI m/m', currency: 'USD' as Currency, impact: 'high' as EconomicImpact, time: '13:30' },
    { event: 'FOMC Meeting Minutes', currency: 'USD' as Currency, impact: 'high' as EconomicImpact, time: '19:00' },
    { event: 'Unemployment Rate', currency: 'USD' as Currency, impact: 'high' as EconomicImpact, time: '13:30' },
    { event: 'Retail Sales m/m', currency: 'USD' as Currency, impact: 'high' as EconomicImpact, time: '13:30' },
    { event: 'GDP q/q', currency: 'USD' as Currency, impact: 'high' as EconomicImpact, time: '13:30' },
    { event: 'Federal Funds Rate', currency: 'USD' as Currency, impact: 'high' as EconomicImpact, time: '19:00' },
    { event: 'ECB Interest Rate Decision', currency: 'EUR' as Currency, impact: 'high' as EconomicImpact, time: '12:45' },
    { event: 'BOE Interest Rate Decision', currency: 'GBP' as Currency, impact: 'high' as EconomicImpact, time: '12:00' },
    { event: 'German ZEW Economic Sentiment', currency: 'EUR' as Currency, impact: 'medium' as EconomicImpact, time: '10:00' },
    { event: 'UK Claimant Count Change', currency: 'GBP' as Currency, impact: 'low' as EconomicImpact, time: '07:00' },
    { event: 'ADP Non-Farm Employment Change', currency: 'USD' as Currency, impact: 'medium' as EconomicImpact, time: '13:15' },
    { event: 'Initial Jobless Claims', currency: 'USD' as Currency, impact: 'medium' as EconomicImpact, time: '13:30' },
    { event: 'Manufacturing PMI', currency: 'USD' as Currency, impact: 'medium' as EconomicImpact, time: '14:45' },
    { event: 'Services PMI', currency: 'EUR' as Currency, impact: 'medium' as EconomicImpact, time: '09:00' },
    { event: 'Producer Price Index m/m', currency: 'USD' as Currency, impact: 'medium' as EconomicImpact, time: '13:30' },
    { event: 'Trade Balance', currency: 'GBP' as Currency, impact: 'low' as EconomicImpact, time: '07:00' },
];

// Generate realistic forecast/previous values
const generateValue = (eventName: string): { forecast: string, previous: string } => {
    if (eventName.includes('Rate') || eventName.includes('CPI') || eventName.includes('GDP')) {
        const prev = (Math.random() * 2).toFixed(1) + '%';
        const forecast = (Math.random() * 2).toFixed(1) + '%';
        return { forecast, previous: prev };
    }
    if (eventName.includes('Employment') || eventName.includes('Payrolls') || eventName.includes('Claims')) {
        const prev = (Math.random() * 500).toFixed(0) + 'K';
        const forecast = (Math.random() * 500).toFixed(0) + 'K';
        return { forecast, previous: prev };
    }
    if (eventName.includes('PMI') || eventName.includes('Sentiment')) {
        const prev = (Math.random() * 30 + 40).toFixed(1);
        const forecast = (Math.random() * 30 + 40).toFixed(1);
        return { forecast, previous: prev };
    }
    return { forecast: '-', previous: '-' };
};

// Generate events for a specific date range
export const generateEconomicEvents = (startDate: Date, daysCount: number = 7): EconomicEvent[] => {
    const events: EconomicEvent[] = [];
    const eventsPerDay = 3; // Average number of events per day

    for (let day = 0; day < daysCount; day++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + day);

        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        // Generate 2-4 events per day
        const numEvents = Math.floor(Math.random() * 3) + 2;

        for (let i = 0; i < numEvents; i++) {
            const template = economicEventTemplates[Math.floor(Math.random() * economicEventTemplates.length)];
            const values = generateValue(template.event);

            events.push({
                id: `${date.toISOString()}-${i}-${Math.random()}`,
                time: template.time,
                date: date.toISOString().split('T')[0],
                currency: template.currency,
                event: template.event,
                impact: template.impact,
                forecast: values.forecast,
                previous: values.previous
            });
        }
    }

    // Sort by date and time
    return events.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
    });
};

// Get events for today
export const getTodayEvents = (): EconomicEvent[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return generateEconomicEvents(today, 1);
};

// Get events for this week
export const getWeekEvents = (): EconomicEvent[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return generateEconomicEvents(today, 7);
};

// Get upcoming events (next 5 events from now)
export const getUpcomingEvents = (count: number = 5): EconomicEvent[] => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Generate events for the next 7 days
    const allEvents = generateEconomicEvents(today, 7);

    // Filter events that haven't occurred yet
    const upcomingEvents = allEvents.filter(event => {
        const eventDate = new Date(event.date);
        const [hours, minutes] = event.time.split(':').map(Number);
        eventDate.setHours(hours, minutes, 0, 0);
        return eventDate > now;
    });

    return upcomingEvents.slice(0, count);
};

// Get next event
export const getNextEvent = (): EconomicEvent | null => {
    const upcoming = getUpcomingEvents(1);
    return upcoming.length > 0 ? upcoming[0] : null;
};

export const fetchRealEvents = async (): Promise<EconomicEvent[]> => {
    try {
        // Use corsproxy.io to fetch the official ForexFactory JSON feed
        const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://nfs.faireconomy.media/ff_calendar_thisweek.json');
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        return data.map((item: any, index: number) => {
            const dateObj = new Date(item.date);

            // Format time as HH:MM
            const time = dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            // Format date as YYYY-MM-DD
            const date = dateObj.toISOString().split('T')[0];

            return {
                id: `ff-${index}-${Date.now()}`,
                date: date,
                time: time,
                currency: item.country,
                event: item.title,
                impact: item.impact.toLowerCase(),
                forecast: item.forecast || '-',
                previous: item.previous || '-'
            };
        });
    } catch (error) {
        console.error("Failed to fetch real events:", error);
        return [];
    }
};

// Calculate time until next event
export const getTimeUntilEvent = (event: EconomicEvent): { hours: number, minutes: number, seconds: number } => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const [hours, minutes] = event.time.split(':').map(Number);
    eventDate.setHours(hours, minutes, 0, 0);

    const diff = eventDate.getTime() - now.getTime();

    if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return { hours: h, minutes: m, seconds: s };
};
