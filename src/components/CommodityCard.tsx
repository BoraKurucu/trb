import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { Commodity } from '../services/websocket';

interface CommodityCardProps {
    commodity: Commodity;
}

export function CommodityCard({ commodity }: CommodityCardProps) {
    const isPositive = commodity.change24h >= 0;

    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold leading-none tracking-tight">{commodity.name}</h3>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">${commodity.price.toFixed(2)}</span>
                <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {Math.abs(commodity.change24h)}%
                </span>
            </div>

            <p className="text-xs text-muted-foreground">
                Live market price
            </p>
        </div>
    );
}
