'use client'

import React from 'react';
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  ClipboardList, 
  CheckCircle, 
  Package, 
  Truck, 
  BarChart3, 
  LayoutDashboard, 
  ArrowRight,
  Boxes
} from 'lucide-react';

export default function HomePage() {
  const modules = [
    {
      title: "Work Order (WO)",
      description: "Buat perintah kerja baru untuk produksi incoming.",
      href: "/WO",
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "hover:border-blue-200"
    },
    {
      title: "Quality Control (FG)",
      description: "Input hasil pemeriksaan barang (OK/Reject).",
      href: "/FG",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "hover:border-green-200"
    },
    {
      title: "Storage (Putaway)",
      description: "Atur penempatan barang masuk ke rak gudang.",
      href: "/Storage",
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "hover:border-purple-200"
    },
    {
      title: "Delivery Order",
      description: "Proses pengiriman barang keluar ke customer.",
      href: "/Delivery",
      icon: Truck,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "hover:border-orange-200"
    },
    {
      title: "Stock Monitor",
      description: "Lihat daftar inventaris dan sisa stok real-time.",
      href: "/stock",
      icon: Boxes,
      color: "text-slate-600",
      bg: "bg-slate-50",
      border: "hover:border-slate-200"
    },
    {
      title: "Dashboard Analytics",
      description: "Grafik statistik produksi dan pergerakan barang.",
      href: "/dashboard",
      icon: BarChart3,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "hover:border-red-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <div className="bg-white border-b px-8 py-12 mb-8">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Warehouse Management System</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <main className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((item, index) => (
            <Link key={index} href={item.href} className="group">
              <Card className={`h-full transition-all duration-200 hover:shadow-lg border border-gray-200 ${item.border}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${item.bg} ${item.color} mb-4 transition-transform group-hover:scale-110`}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-500">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Stats Summary (Opsional - Static Preview) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total WO Pending</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm font-medium text-gray-500">Ready for Delivery</p>
            <h3 className="text-2xl font-bold text-green-600 mt-1">450 Pcs</h3>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">3 SKUs</h3>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Shipments</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-1">89</h3>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} WMS System - Internal Use Only.
        </div>
      </footer>
    </div>
  );
}