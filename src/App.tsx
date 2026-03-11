import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useCommodityData } from './services/websocket';
import { CommodityCard } from './components/CommodityCard';

export default function App() {
    const { data, history, connected, error } = useCommodityData();

    // Loading state
    if (!connected && !error) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-muted-foreground text-sm font-medium animate-pulse">Connecting to market data...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background p-4">
                <div className="rounded-xl border border-destructive bg-destructive/10 p-6 text-destructive flex flex-col items-center text-center max-w-md shadow-lg">
                    <h2 className="text-xl font-bold mb-2">Connection Error</h2>
                    <p className="text-sm opacity-90">{error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                        onClick={() => window.location.reload()}
                    >
                        Reconnect
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 font-sans selection:bg-primary/20">
            <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">

                {/* Header Section */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Commodity Markets</h1>
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">Real-time agricultural pricing dashboard</p>
                    </div>
                    <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border shadow-sm">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                        </span>
                        <span className="text-sm font-semibold text-foreground/80">Live WebSocket</span>
                    </div>
                </header>

                {/* Commodity Cards Grid */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {data.map((commodity) => (
                        <CommodityCard key={commodity.id} commodity={commodity} />
                    ))}
                </section>

                {/* Main Content Area (Chart + Table) */}
                <div className="grid gap-6 lg:grid-cols-7 items-start pb-8">

                    {/* Chart Section */}
                    <section className="lg:col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm p-6 overflow-hidden">
                        <div className="mb-6 flex flex-col gap-1">
                            <h3 className="font-semibold text-lg leading-none tracking-tight">Price Movement (Live)</h3>
                            <p className="text-sm text-muted-foreground">Real-time price ticks over the active session</p>
                        </div>

                        {/* The wrapper ensures responsive container stretches correctly */}
                        <div className="h-[350px] w-full -ml-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                                    <XAxis
                                        dataKey="time"
                                        tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                                        axisLine={false}
                                        tickLine={false}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        domain={['auto', 'auto']}
                                        tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                        width={50}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: '8px',
                                            color: 'hsl(var(--foreground))',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                                        }}
                                        itemStyle={{ fontSize: '13px', fontWeight: 500, padding: '2px 0' }}
                                        labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}
                                    />
                                    <Legend
                                        wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }}
                                        iconType="circle"
                                        iconSize={8}
                                    />

                                    {/* Colors for lines: Wheat, Corn, Barley, Sunflower */}
                                    {data.map((commodity, index) => {
                                        const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
                                        return (
                                            <Line
                                                key={commodity.name}
                                                type="monotone"
                                                dataKey={commodity.name}
                                                name={commodity.name}
                                                stroke={colors[index % colors.length]}
                                                strokeWidth={2.5}
                                                dot={false}
                                                activeDot={{ r: 5, strokeWidth: 0 }}
                                                isAnimationActive={false} // Disable animation for pure real-time feel
                                            />
                                        );
                                    })}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    {/* Table Section */}
                    <section className="lg:col-span-3 rounded-xl border bg-card text-card-foreground shadow-sm p-0 overflow-hidden">
                        <div className="p-6 pb-4 border-b bg-muted/20">
                            <h3 className="font-semibold text-lg leading-none tracking-tight mb-1">Market Overview</h3>
                            <p className="text-sm text-muted-foreground">Detailed view with latest changes</p>
                        </div>
                        <div className="relative w-full overflow-auto max-h-[400px]">
                            <table className="w-full text-sm">
                                <thead className="[&_tr]:border-b bg-muted/40 sticky top-0 z-10 backdrop-blur-sm">
                                    <tr className="border-b transition-colors">
                                        <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">Asset</th>
                                        <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">Last Price</th>
                                        <th className="h-11 px-4 text-right align-middle font-medium text-muted-foreground">24h Change</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0 divide-y">
                                    {data.map((commodity) => (
                                        <tr key={commodity.id} className="transition-colors hover:bg-muted/50 group">
                                            <td className="p-4 align-middle font-medium">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-foreground/90">{commodity.name}</span>
                                                    <span className="text-xs font-normal text-muted-foreground">
                                                        {new Date(commodity.lastUpdate).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle font-bold text-foreground/90">${commodity.price.toFixed(2)}</td>
                                            <td className="p-4 align-middle text-right">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold font-mono tracking-tight ${commodity.change24h >= 0
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                                    }`}>
                                                    {commodity.change24h >= 0 ? '+' : ''}{commodity.change24h.toFixed(2)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
