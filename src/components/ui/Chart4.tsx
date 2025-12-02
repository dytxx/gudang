'use client'

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

// --- Data Dummy Stock Movement untuk PA-12V-001 (30 Hari Simulasi) ---
const pa12vStockData = [
    { date: "2025-12-01", stock: 1500 },
    { date: "2025-12-02", stock: 1450 },
    { date: "2025-12-03", stock: 2000 }, // Penerimaan stok besar
    { date: "2025-12-04", stock: 1900 },
    { date: "2025-12-05", stock: 1850 },
    { date: "2025-12-06", stock: 1700 },
    { date: "2025-12-07", stock: 2500 }, // Penerimaan stok
    { date: "2025-12-08", stock: 2400 },
    { date: "2025-12-09", stock: 2350 },
    { date: "2025-12-10", stock: 2300 },
    { date: "2025-12-11", stock: 3000 }, // Penerimaan stok
    { date: "2025-12-12", stock: 2950 },
    { date: "2025-12-13", stock: 2800 },
    { date: "2025-12-14", stock: 2750 },
    { date: "2025-12-15", stock: 2700 },
    { date: "2025-12-16", stock: 2600 },
    { date: "2025-12-17", stock: 3500 }, // Penerimaan stok besar
    { date: "2025-12-18", stock: 3400 },
    { date: "2025-12-19", stock: 3350 },
    { date: "2025-12-20", stock: 3300 },
    { date: "2025-12-21", stock: 3200 },
    { date: "2025-12-22", stock: 3100 },
    { date: "2025-12-23", stock: 3050 },
    { date: "2025-12-24", stock: 3000 },
    { date: "2025-12-25", stock: 2900 },
    { date: "2025-12-26", stock: 2850 },
    { date: "2025-12-27", stock: 2800 },
    { date: "2025-12-28", stock: 2700 },
    { date: "2025-12-29", stock: 2650 },
    { date: "2025-12-30", stock: 2600 }, // Stok saat ini
];

const chartConfigStockPA = {
    stock: {
        label: "Stock Quantity (Pcs)",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig

const chart4 =()=> {

    const productCode = "PA-12V-001"; 

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Stok Harian</CardTitle>
                    <CardDescription>
                        Pergerakan Stok Item: <span className="font-semibold text-green-600">{productCode}</span> (Power Adapter 12V 2A)
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfigStockPA}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={pa12vStockData}>
                        <defs>
                            <linearGradient id="fillStockPA" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-stock)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-stock)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        
                        <YAxis 
                            stroke="#888888" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(value) => value.toLocaleString('id-ID')}
                        />
                        
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "numeric",
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="stock"
                            type="monotone"
                            fill="url(#fillStockPA)"
                            stroke="var(--color-stock)"
                            name="Stock Quantity (Pcs)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
export default chart4;