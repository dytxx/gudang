'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, MapPin, PackageCheck, Loader2 } from 'lucide-react';

const ROWS = ['A', 'B', 'C', 'D', 'E'];
const LEVELS = [4, 3, 2, 1]; 

export default function StoragePage() {
    const [warehouse, setWarehouse] = useState<any[]>([]);
    const [qcList, setQcList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({ qcNumber: '', productName: '', quantity: '', location: '', notes: '' });

    // Fetch Data
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [resStorage, resQC] = await Promise.all([
                    fetch('http://localhost:8080/api/storage').then(r => r.json()),
                    fetch('http://localhost:8080/api/storage/pending-qc').then(r => r.json())
                ]);

                // Build Map
                const slots: any[] = [];
                ROWS.forEach(row => {
                    LEVELS.forEach(level => {
                        const id = `${row}-0${level}`;
                        const item = resStorage[id];
                        slots.push({
                            id, row, level,
                            status: item ? 'occupied' : 'empty',
                            product: item?.name,
                            quantity: item?.quantity,
                            fg_number: item?.fg_number
                        });
                    });
                });
                setWarehouse(slots);
                if (Array.isArray(resQC)) setQcList(resQC);
            } catch (e) { console.error(e); } 
            finally { setIsLoading(false); }
        };
        loadData();
    }, []);

    const handleQCChange = async (val: string) => {
        const item = qcList.find(q => q.qc_number === val);
        if (!item) return;

        setFormData({ ...formData, qcNumber: val, productName: item.product_code, quantity: item.checked_quantity });

        // Auto Indexing
        try {
            const res = await fetch(`http://localhost:8080/api/storage/recommend?product_name=${item.product_code}`);
            const rec = await res.json();
            if (rec.location) {
                setFormData(prev => ({ ...prev, location: rec.location }));
                // Highlight Map
                setWarehouse(prev => prev.map(s => ({
                    ...s, 
                    status: s.id === rec.location ? 'selected' : (s.status === 'selected' ? 'empty' : s.status)
                })));
            } else { alert("Gudang Penuh!"); }
        } catch (e) { console.error("Gagal auto-index"); }
    };

    const handleSlotClick = (id: string) => {
        const slot = warehouse.find(s => s.id === id);
        if (slot?.status === 'occupied') {
            alert(`📦 Info Slot ${id}\nFG ID: ${slot.fg_number}\nProduk: ${slot.product}\nQty: ${slot.quantity}`);
            return;
        }
        setWarehouse(prev => prev.map(s => ({
            ...s, status: s.id === id ? 'selected' : (s.status === 'selected' ? 'empty' : s.status)
        })));
        setFormData(prev => ({ ...prev, location: id }));
    };

    const handleSubmit = async () => {
        if (!formData.location || !formData.qcNumber) return alert("Data tidak lengkap!");
        try {
            const res = await fetch('http://localhost:8080/api/storage/submit', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
            });
            const result = await res.json();
            if (res.ok) { alert(`✅ ${result.message}`); window.location.reload(); }
            else { alert(`❌ ${result.message}`); }
        } catch (e) { alert("Error koneksi."); }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><PackageCheck className="text-blue-600"/> Storage Putaway</h1>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1">
                    <Card>
                        <CardHeader><CardTitle>📥 Proses Masuk</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Pilih QC Number</Label>
                                <Select onValueChange={handleQCChange}>
                                    <SelectTrigger><SelectValue placeholder="-- Pilih QC Pass --" /></SelectTrigger>
                                    <SelectContent>
                                        {qcList.length === 0 ? <SelectItem value="x" disabled>Empty</SelectItem> : 
                                            qcList.map(q => <SelectItem key={q.id} value={q.qc_number}>{q.qc_number} - {q.product_code}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>Produk</Label><Input value={formData.productName} readOnly className="bg-gray-100 font-bold"/></div>
                            <div className="space-y-2"><Label>Qty</Label><Input value={formData.quantity} readOnly className="bg-gray-100"/></div>
                            <div className="space-y-2"><Label className="text-blue-600">Lokasi (Auto)</Label><div className="flex gap-2"><Input value={formData.location} readOnly className="bg-blue-50 font-bold border-blue-200"/><Button variant="outline" size="icon"><MapPin className="w-4 h-4"/></Button></div></div>
                            <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 h-12 mt-4 font-bold">SIMPAN (PUTAWAY)</Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="xl:col-span-2">
                    <Card className="h-full">
                        <CardHeader className="bg-gray-50 border-b"><CardTitle>🏭 Denah Gudang</CardTitle></CardHeader>
                        <CardContent className="pt-6">
                            {isLoading ? <div className="h-64 flex justify-center items-center"><Loader2 className="animate-spin"/></div> : (
                                <div className="overflow-x-auto pb-2"><div className="min-w-[600px] flex gap-4 justify-center">
                                    {ROWS.map(row => (
                                        <div key={row} className="flex flex-col gap-2">
                                            <div className="text-center font-bold text-white bg-slate-700 rounded py-1 shadow">RAK {row}</div>
                                            {LEVELS.map(level => {
                                                const id = `${row}-0${level}`;
                                                const slot = warehouse.find(s => s.id === id);
                                                return (
                                                    <button key={id} onClick={() => handleSlotClick(id)} className={`
                                                        w-24 h-16 border-2 rounded-lg flex flex-col items-center justify-center relative group shadow-sm transition-all
                                                        ${slot?.status === 'occupied' ? 'bg-red-50 border-red-200 hover:bg-red-100' : 'bg-green-50 border-green-200 hover:bg-green-100'}
                                                        ${slot?.status === 'selected' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                                                    `}>
                                                        <span className="text-xs font-bold text-slate-600">{id}</span>
                                                        {slot?.status === 'occupied' && <Box className="w-5 h-5 text-red-400 mt-1"/>}
                                                        {slot?.status === 'occupied' && (
                                                            <div className="absolute hidden group-hover:block bottom-full mb-1 bg-black text-white text-[10px] p-2 rounded w-max z-20 text-left shadow-lg">
                                                                <p className="text-yellow-300 font-bold border-b border-gray-600 mb-1">{slot.fg_number}</p>
                                                                <p>{slot.product}</p><p>Qty: {slot.quantity}</p>
                                                            </div>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    ))}
                                </div></div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}