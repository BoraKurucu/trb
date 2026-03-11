import { useState, useEffect } from 'react';

// Shared Types for the commodity data
export interface Commodity {
    id: string;
    name: string;
    price: number;
    change24h: number;
    lastUpdate: number;
}

export interface ChartDataPoint {
    time: string;
    [key: string]: string | number;
}

// Initial state of our Mock Data
const initialCommodities: Commodity[] = [
    { id: 'WHEAT', name: 'Wheat', price: 650.25, change24h: 1.2, lastUpdate: Date.now() },
    { id: 'CORN', name: 'Corn', price: 430.50, change24h: -0.5, lastUpdate: Date.now() },
    { id: 'BARLEY', name: 'Barley', price: 320.10, change24h: 0.8, lastUpdate: Date.now() },
    { id: 'SUNFLOWER', name: 'Sunflower Seeds', price: 540.75, change24h: 2.1, lastUpdate: Date.now() },
];

/**
 * Custom Hook: useCommodityData
 * Subscribes to our "mock" WebSocket server which pushes random price updates every 2s.
 */
export function useCommodityData() {
    const [data, setData] = useState<Commodity[]>(initialCommodities);
    const [history, setHistory] = useState<ChartDataPoint[]>([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate a brief connection delay
        const connectTimer = setTimeout(() => {
            setConnected(true);
            setError(null);

            // Initialize some initial chart history
            const initialHistory: ChartDataPoint[] = [];
            const now = new Date();
            for (let i = 10; i >= 0; i--) {
                const time = new Date(now.getTime() - i * 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                initialHistory.push({
                    time,
                    Wheat: initialCommodities[0].price,
                    Corn: initialCommodities[1].price,
                    Barley: initialCommodities[2].price,
                    "Sunflower Seeds": initialCommodities[3].price,
                });
            }
            setHistory(initialHistory);

        }, 500);

        // Mock WebSocket Server pushing updates every 2 seconds
        const interval = setInterval(() => {
            setData((prevData) => {
                // Calculate new prices
                const newData = prevData.map((item) => {
                    const change = (Math.random() * 4 - 2);
                    const newPrice = Math.max(0.01, item.price + change);

                    return {
                        ...item,
                        price: Number(newPrice.toFixed(2)),
                        change24h: Number((item.change24h + (change * 0.1)).toFixed(2)),
                        lastUpdate: Date.now(),
                    };
                });

                // Update History for the chart
                setHistory((prevHistory) => {
                    const newPoint: ChartDataPoint = {
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    };
                    newData.forEach(c => newPoint[c.name] = c.price);

                    const newHistory = [...prevHistory, newPoint];
                    if (newHistory.length > 20) newHistory.shift(); // Keep only last 20 ticks
                    return newHistory;
                });

                return newData;
            });
        }, 2000);

        return () => {
            clearTimeout(connectTimer);
            clearInterval(interval);
            setConnected(false); // Disconnect on unmount
        };
    }, []);

    return { data, history, connected, error };
}
