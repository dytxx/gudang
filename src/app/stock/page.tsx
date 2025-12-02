'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, RotateCcw } from 'lucide-react'; // Menggunakan ikon dari lucide-react

// --- Data Dummy (Simulasi Data Stok yang Sudah Di-Acc) ---
const dummyStockData = [
    {
        id: 'FG1001',
        productName: 'Wireless Router 5G-PRO',
        productCode: 'PRO-5G-RT',
        quantity: 500,
        unit: 'Pcs',
        qcReport: 'QC251128001',
        acceptedDate: '28/11/25',
        location: 'WH-A01',
    },
    {
        id: 'FG1002',
        productName: 'Fiber Optic Cable (500m)',
        productCode: 'FOC-500M',
        quantity: 120,
        unit: 'Roll',
        qcReport: 'QC251129002',
        acceptedDate: '29/11/25',
        location: 'WH-B03',
    },
    {
        id: 'FG1003',
        productName: 'Network Switch 24 Port',
        productCode: 'SW-24P-V2',
        quantity: 350,
        unit: 'Unit',
        qcReport: 'QC251201003',
        acceptedDate: '01/12/25',
        location: 'WH-A01',
    },
    {
        id: 'FG1004',
        productName: 'Power Adapter 12V 2A',
        productCode: 'PA-12V-001',
        quantity: 1500,
        unit: 'Pcs',
        qcReport: 'QC251202004',
        acceptedDate: '02/12/25',
        location: 'WH-C05',
    },
];

export default function ApprovedFinishGoodsStockPage() {
    // State untuk menyimpan data stok yang akan ditampilkan (bisa disaring)
    const [stockData, setStockData] = useState(dummyStockData);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Untuk simulasi loading saat refresh

    // Fungsi untuk menyaring data berdasarkan Product Code atau Product Name
    const handleSearch = () => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        
        const filteredData = dummyStockData.filter(item => 
            item.productName.toLowerCase().includes(lowerCaseSearch) || 
            item.productCode.toLowerCase().includes(lowerCaseSearch) ||
            item.qcReport.toLowerCase().includes(lowerCaseSearch)
        );

        setStockData(filteredData);
    };

    // Fungsi untuk mereset pencarian dan memuat ulang (simulasi)
    const handleRefresh = () => {
        setIsLoading(true);
        setSearchTerm('');
        // Simulasi fetching data dari API
        setTimeout(() => {
            setStockData(dummyStockData); // Reset ke data asli
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto p-8">
                <h1 className="text-2xl font-bold mb-6 flex items-center">
                    📦 Finish Goods Approved Stock
                </h1>
                <p className="text-gray-600 mb-6">
                    Daftar stok barang jadi yang telah melewati proses Quality Check (QC) dan disetujui untuk masuk gudang (Accepted).
                </p>

                {/* --- Kontrol Pencarian dan Refresh --- */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    {/* Input Pencarian */}
                    <div className="flex flex-1 max-w-lg relative">
                        <Input
                            placeholder="Cari berdasarkan Kode Produk, Nama, atau No. QC..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                            className="pr-10"
                        />
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleSearch} 
                            className="absolute right-0 top-0 h-full px-3"
                        >
                            <Search className="h-4 w-4 text-gray-500" />
                        </Button>
                    </div>

                    {/* Tombol Refresh */}
                    <Button 
                        onClick={handleRefresh} 
                        variant="outline"
                        disabled={isLoading}
                    >
                        <RotateCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Loading...' : 'Refresh Data'}
                    </Button>
                </div>

                {/* --- Tabel Stok --- */}
                <div className="border rounded-lg overflow-hidden shadow-sm">
                    {stockData.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Tidak ada data stok yang ditemukan.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-gray-100">
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Product Code</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>QC Report</TableHead>
                                    <TableHead>Acc. Date</TableHead>
                                    <TableHead>Location</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stockData.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.id}</TableCell>
                                        <TableCell>{item.productCode}</TableCell>
                                        <TableCell>{item.productName}</TableCell>
                                        <TableCell className="text-right font-semibold text-blue-600">
                                            {item.quantity.toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell>{item.unit}</TableCell>
                                        <TableCell className="text-sm text-gray-500">{item.qcReport}</TableCell>
                                        <TableCell>{item.acceptedDate}</TableCell>
                                        <TableCell className="font-medium bg-green-50/50">{item.location}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
                
                {/* --- Footer Informasi --- */}
                <div className="mt-4 text-sm text-gray-500">
                    Total {stockData.length} SKU terdaftar.
                </div>
            </main>
        </div>
    );
}