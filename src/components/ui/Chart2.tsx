'use client'

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

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

// --- Data Dummy Stock Movement untuk PRO-5G-RT (30 Hari Simulasi) ---
const stockMovementData = [
    { date: "2025-12-01", stock: 150 },
    { date: "2025-12-02", stock: 120 },
    { date: "2025-12-03", stock: 120 },
    { date: "2025-12-04", stock: 250 }, // Penerimaan stok
    { date: "2025-12-05", stock: 200 },
    { date: "2025-12-06", stock: 350 }, // Penerimaan stok
    { date: "2025-12-07", stock: 300 },
    { date: "2025-12-08", stock: 280 },
    { date: "2025-12-09", stock: 400 }, // Penerimaan stok
    { date: "2025-12-10", stock: 350 },
    { date: "2025-12-11", stock: 320 },
    { date: "2025-12-12", stock: 450 },
    { date: "2025-12-13", stock: 400 },
    { date: "2025-12-14", stock: 380 },
    { date: "2025-12-15", stock: 360 },
    { date: "2025-12-16", stock: 360 },
    { date: "2025-12-17", stock: 480 }, // Penerimaan stok
    { date: "2025-12-18", stock: 450 },
    { date: "2025-12-19", stock: 420 },
    { date: "2025-12-20", stock: 420 },
    { date: "2025-12-21", stock: 550 }, // Penerimaan stok
    { date: "2025-12-22", stock: 500 },
    { date: "2025-12-23", stock: 480 },
    { date: "2025-12-24", stock: 450 },
    { date: "2025-12-25", stock: 400 },
    { date: "2025-12-26", stock: 350 },
    { date: "2025-12-27", stock: 300 },
    { date: "2025-12-28", stock: 400 }, // Penerimaan stok
    { date: "2025-12-29", stock: 380 },
    { date: "2025-12-30", stock: 350 }, // Stok saat ini
];

const chartConfigStock = {
    stock: {
        label: "Stock Quantity (Pcs)",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

const chart2 =()=> {

    const productCode = "PRO-5G-RT"; // Kode produk yang difokuskan

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Stok Harian</CardTitle>
                    <CardDescription>
                        Pergerakan Stok Item: <span className="font-semibold text-blue-600">{productCode}</span> (Wireless Router 5G-PRO)
                    </CardDescription>
                </div>
                {/* Bagian Select Time Range Dihapus untuk menyederhanakan demo data */}
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfigStock}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={stockMovementData}>
                        <defs>
                            <linearGradient id="fillStock" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-stock)" // Menggunakan warna dari chartConfig
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
                        
                        {/* YAxis ditambahkan agar nilai kuantitas terlihat */}
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
                            // Format tanggal menjadi DD/MM
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
                            dataKey="stock" // Menggunakan key 'stock'
                            type="monotone" // Menggunakan type monotone untuk kurva yang lebih halus
                            fill="url(#fillStock)"
                            stroke="var(--color-stock)"
                            name="Stock Quantity (Pcs)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
export default chart2;