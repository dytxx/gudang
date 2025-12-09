"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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

const chartConfig = {
  quantity: {
    label: "Quantity",
  },
  pass: {
    label: "QC Pass",
    color: "var(--chart-3)", // Warna Biru Tua
  },
  remaining: {
    label: "Masih di WO",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig

export default function Chart3() {
  const [data, setData] = React.useState([
    { status: "QC Pass", quantity: 0, fill: "var(--color-pass)" },
    { status: "Masih di WO", quantity: 0, fill: "var(--color-remaining)" },
  ])
  const [totalTarget, setTotalTarget] = React.useState(0)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/wo")
        const json = await res.json()

        if (Array.isArray(json)) {
          // Filter untuk SYSTEM 3
          const systemData = json.filter((item: any) => item.part_number === "SYSTEM 3")

          let totalPass = 0
          let totalRemaining = 0
          let target = 0

          systemData.forEach((item: any) => {
            totalPass += Number(item.total_pass)
            totalRemaining += Number(item.remaining_qty)
            target += Number(item.target_qty)
          })

          setData([
            { status: "QC Pass", quantity: totalPass, fill: "var(--color-pass)" },
            { status: "Masih di WO", quantity: totalRemaining, fill: "var(--color-remaining)" },
          ])
          setTotalTarget(target)
        }
      } catch (error) {
        console.error("Gagal mengambil data SYSTEM 3:", error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Stok SYSTEM 3</CardTitle>
        <CardDescription>Target Produksi: {totalTarget} Unit</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              left: 0,
              right: 0,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="status" type="category" hide />
            <XAxis dataKey="quantity" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="quantity" layout="vertical" radius={5}>
              <LabelList
                dataKey="status"
                position="insideLeft"
                offset={8}
                className="fill-white font-bold"
                fontSize={12}
              />
              <LabelList
                dataKey="quantity"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}