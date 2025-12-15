'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, PackageMinus, MapPin, User, Box } from 'lucide-react';

export default function DeliveryPage() {
    const [doNumber, setDoNumber] = useState('Generating...');
    const [storageList, setStorageList] = useState<any[]>([]); 
    const [selectedItem, setSelectedItem] = useState<any>(null); 

    const [formData, setFormData] = useState({
        customer_name: '', 
        destination: '',
        storage_id: '',
        qty_delivery: '',
        notes: ''
    });

    useEffect(() => {
        // Ambil No DO Otomatis
        fetch('http://localhost:8080/api/delivery/generate-number')
            .then(res => res.json()).then(data => setDoNumber(data.doNumber));

        // Ambil Data Stok Gudang (Qty > 0)
        fetch('http://localhost:8080/api/storage')
            .then(res => res.json())
            .then(data => {
                const arr = Array.isArray(data) ? data : Object.values(data);
                setStorageList(arr.filter((item: any) => parseInt(item.quantity) > 0));
            });
    }, []);

    const handleItemChange = (storageId: string) => {
        const item = storageList.find(s => s.id === storageId);
        setSelectedItem(item);
        setFormData(prev => ({ ...prev, storage_id: storageId }));
    };

    const handleSubmit = async () => {
        if (!formData.customer_name || !formData.storage_id || !formData.qty_delivery || !formData.destination) {
            alert("Harap lengkapi semua data!");
            return;
        }
        
        if (selectedItem && parseInt(formData.qty_delivery) > parseInt(selectedItem.quantity)) {
            alert(`❌ Stok tidak cukup! Maksimal: ${selectedItem.quantity}`);
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/delivery/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ do_number: doNumber, ...formData }),
            });

            const result = await res.json();
            if (res.ok) {
                alert(`✅ ${result.message}`);
                window.location.reload();
            } else {
                alert(`❌ ${result.message}`);
            }
        } catch (error) { alert("Gagal koneksi."); }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Truck className="text-orange-600 h-8 w-8"/> Delivery Order
                </h1>
                
                <Card className="border-t-4 border-t-orange-500 shadow-lg">
                    <CardHeader className="bg-orange-50/50 border-b">
                        <CardTitle className="text-orange-800 flex items-center gap-2">
                            📋 Form Pengiriman Barang
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-6 pt-6">
                        
                        {/* 1. NO DO (FULL WIDTH) */}
                        <div className="w-full space-y-2">
                            <Label className="text-sm font-semibold text-gray-600">No. Delivery Order (DO)</Label>
                            <Input value={doNumber} readOnly className="bg-slate-100 font-mono font-bold text-lg h-12 border-slate-300 w-full"/>
                        </div>

                        {/* 2. CUSTOMER & TUJUAN (SEJAJAR 50:50) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            {/* Kiri: Customer */}
                            <div className="space-y-2 w-full">
                                <Label className="flex items-center gap-2 font-bold text-gray-700">
                                    <User className="w-4 h-4 text-blue-600"/> Customer
                                </Label>
                                <Select onValueChange={(val) => setFormData({...formData, customer_name: val})}>
                                    {/* TAMBAHKAN w-full DISINI */}
                                    <SelectTrigger className="h-11 bg-white border-slate-300 focus:ring-orange-500 w-full">
                                        <SelectValue placeholder="-- Pilih Customer --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PT. TELEKOMUNIKASI INDONESIA">PT. TELEKOMUNIKASI INDONESIA</SelectItem>
                                        <SelectItem value="PT. XL AXIATA">PT. XL AXIATA</SelectItem>
                                        <SelectItem value="PT. INDOSAT OOREDOO HUTCHISON">PT. INDOSAT OOREDOO HUTCHISON</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Kanan: Tujuan */}
                            <div className="space-y-2 w-full">
                                <Label className="flex items-center gap-2 font-bold text-gray-700">
                                    <MapPin className="w-4 h-4 text-red-600"/> Kota Tujuan
                                </Label>
                                <Select onValueChange={(val) => setFormData({...formData, destination: val})}>
                                    {/* TAMBAHKAN w-full DISINI */}
                                    <SelectTrigger className="h-11 bg-white border-slate-300 focus:ring-orange-500 w-full">
                                        <SelectValue placeholder="-- Pilih Kota Tujuan --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Palembang">Palembang</SelectItem>
                                        <SelectItem value="Lampung">Lampung</SelectItem>
                                        <SelectItem value="Semarang">Semarang</SelectItem>
                                        <SelectItem value="Surabaya">Surabaya</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <hr className="border-dashed border-gray-300 my-4"/>
                        
                        {/* 3. PILIH BARANG (FULL WIDTH) */}
                        <div className="w-full space-y-2">
                            <Label className="flex items-center gap-2 font-bold text-gray-700 text-lg">
                                <Box className="w-5 h-5 text-purple-600"/> Pilih Barang (Source Gudang)
                            </Label>
                            <Select onValueChange={handleItemChange}>
                                {/* TAMBAHKAN w-full DISINI */}
                                <SelectTrigger className="h-14 text-base bg-white border-slate-300 shadow-sm focus:ring-orange-500 w-full">
                                    <SelectValue placeholder="-- Cari berdasarkan FG ID / Nama Barang --" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {storageList.map((item) => (
                                        <SelectItem key={item.id} value={item.id} className="py-3 cursor-pointer">
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                                                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                                    {item.fg_number || 'NoID'}
                                                </span>
                                                <span className="font-medium text-gray-700">{item.name}</span>
                                                <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100 text-xs md:text-sm ml-auto md:ml-2">
                                                    Stok: {item.quantity}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                            {/* Detail Barang Terpilih */}
                            {selectedItem && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="bg-blue-50/80 p-3 rounded-md border border-blue-200 mt-2 flex justify-between items-center text-sm text-blue-900 w-full">
                                        <span>Lokasi Rak: <strong>{selectedItem.location}</strong></span>
                                        <span>QC Ref: <strong>{selectedItem.sku}</strong></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 4. QTY & CATATAN (SEJAJAR 50:50) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 w-full">
                            {/* Kiri: Qty */}
                            <div className="space-y-2 w-full">
                                <Label className="font-semibold text-gray-700">Jumlah Kirim (Qty)</Label>
                                <div className="relative w-full">
                                    <Input 
                                        type="number" 
                                        value={formData.qty_delivery} 
                                        onChange={(e) => setFormData({...formData, qty_delivery: e.target.value})} 
                                        className="pr-12 text-lg font-bold border-slate-300 h-12 w-full"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-3 top-3 text-gray-400 font-bold text-sm">Pcs</span>
                                </div>
                                {selectedItem && (
                                    <p className="text-xs text-red-500 text-right font-medium">
                                        Maksimal: {selectedItem.quantity}
                                    </p>
                                )}
                            </div>

                            {/* Kanan: Catatan */}
                            <div className="space-y-2 w-full">
                                <Label className="font-semibold text-gray-700">Catatan Pengiriman</Label>
                                <Textarea 
                                    value={formData.notes} 
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    placeholder="Instruksi khusus, driver, plat nomor, dll..."
                                    className="border-slate-300 resize-none h-12 min-h-[48px] w-full"
                                />
                            </div>
                        </div>

                        {/* TOMBOL SUBMIT */}
                        <Button 
                            onClick={handleSubmit} 
                            className="w-full bg-orange-600 hover:bg-orange-700 active:scale-[0.99] transition-all font-bold h-14 text-lg mt-6 shadow-md text-white"
                        >
                            <PackageMinus className="mr-2 h-6 w-6" /> PROSES PENGIRIMAN
                        </Button>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}