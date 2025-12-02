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

// --- Data Dummy Stock Movement untuk SW-24P-V2 (30 Hari Simulasi) ---
const sw24pStockData = [
    { date: "2025-12-01", stock: 300 },
    { date: "2025-12-02", stock: 350 }, // Penerimaan stok
    { date: "2025-12-03", stock: 320 },
    { date: "2025-12-04", stock: 280 },
    { date: "2025-12-05", stock: 250 },
    { date: "2025-12-06", stock: 400 }, // Penerimaan stok besar
    { date: "2025-12-07", stock: 380 },
    { date: "2025-12-08", stock: 350 },
    { date: "2025-12-09", stock: 330 },
    { date: "2025-12-10", stock: 300 },
    { date: "2025-12-11", stock: 500 }, // Penerimaan stok
    { date: "2025-12-12", stock: 450 },
    { date: "2025-12-13", stock: 420 },
    { date: "2025-12-14", stock: 390 },
    { date: "2025-12-15", stock: 360 },
    { date: "2025-12-16", stock: 330 },
    { date: "2025-12-17", stock: 300 },
    { date: "2025-12-18", stock: 280 },
    { date: "2025-12-19", stock: 580 }, // Penerimaan stok
    { date: "2025-12-20", stock: 550 },
    { date: "2025-12-21", stock: 500 },
    { date: "2025-12-22", stock: 480 },
    { date: "2025-12-23", stock: 450 },
    { date: "2025-12-24", stock: 420 },
    { date: "2025-12-25", stock: 400 },
    { date: "2025-12-26", stock: 380 },
    { date: "2025-12-27", stock: 350 },
    { date: "2025-12-28", stock: 320 },
    { date: "2025-12-29", stock: 300 },
    { date: "2025-12-30", stock: 300 }, // Stok saat ini
];

const chartConfigStockSW = {
    stock: {
        label: "Stock Quantity (Unit)",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

const chart3 =()=> {


    const productCode = "SW-24P-V2"; 

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Stok Harian</CardTitle>
                    <CardDescription>
                        Pergerakan Stok Item: <span className="font-semibold text-red-600">{productCode}</span> (Network Switch 24 Port)
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfigStockSW}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={sw24pStockData}>
                        <defs>
                            <linearGradient id="fillStockSW" x1="0" y1="0" x2="0" y2="1">
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
                            fill="url(#fillStockSW)"
                            stroke="var(--color-stock)"
                            name="Stock Quantity (Unit)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
export default chart3;