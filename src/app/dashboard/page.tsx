'use client'

import * as React from "react"
// Impor yang dibutuhkan dari NextAuth.js
import { useSession } from "next-auth/react" 
import { useRouter } from "next/navigation" // Digunakan untuk redirect

import Chart1 from "@/components/ui/Chart1";
import Chart2 from "@/components/ui/Chart2";
import Chart3 from "@/components/ui/Chart3";
import Chart4 from "@/components/ui/Chart4";

export default function Dashboard() {
    return(
        <div className="container">
            
            <div className="grid grid-cols-3 w-full">
                <div className="p-4 text-white text-center">
                    <Chart2 />
                </div>

                <div className="p-4 text-white text-center">
                    <Chart3 />
                </div>

                <div className="p-4 text-white text-center">
                    <Chart4 />
                </div>
            </div>
        </div>
    );
}