'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, MapPin, PackageCheck } from 'lucide-react';

// --- Tipe Data Slot Gudang ---
type StorageSlot = {
    id: string;      
    row: string;     
    level: number;   
    status: 'empty' | 'occupied' | 'selected';
    product?: string;
}

// --- Konfigurasi Map (5 Row x 4 Level) ---
const ROWS = ['A', 'B', 'C', 'D', 'E'];
const LEVELS = [4, 3, 2, 1]; 

// Data Dummy Awal
const generateInitialWarehouse = (): StorageSlot[] => {
    const slots: StorageSlot[] = [];
    ROWS.forEach(row => {
        LEVELS.forEach(level => {
            const id = `${row}-0${level}`;
            const isOccupied = (row === 'A' && level === 1) || (row === 'C' && level === 3);
            slots.push({
                id,
                row,
                level,
                status: isOccupied ? 'occupied' : 'empty',
                product: isOccupied ? 'Existing Product' : undefined
            });
        });
    });
    return slots;
};

export default function StoragePage() {
    const [warehouse, setWarehouse] = useState<StorageSlot[]>(generateInitialWarehouse());
    const [formData, setFormData] = useState({
        qcNumber: '',
        productName: '',
        quantity: '',
        location: '',
        notes: ''
    });

    // --- Handlers ---
    const handleSlotClick = (slotId: string) => {
        const slot = warehouse.find(s => s.id === slotId);
        
        if (slot?.status === 'occupied') {
            alert(`Slot ${slotId} sudah penuh!`);
            return;
        }

        // Reset visual 'selected' sebelumnya
        const newWarehouse = warehouse.map(s => {
            if (s.status === 'selected') return { ...s, status: 'empty' as const };
            return s;
        });

        // Set slot baru jadi 'selected'
        const updatedWarehouse = newWarehouse.map(s => {
            if (s.id === slotId) return { ...s, status: 'selected' as const }; 
            return s;
        });

        setWarehouse(updatedWarehouse);
        setFormData(prev => ({ ...prev, location: slotId }));
    };

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!formData.productName || !formData.quantity || !formData.location) {
            alert("Harap lengkapi data & pilih lokasi!");
            return;
        }

        // Kunci slot menjadi occupied secara permanen
        setWarehouse(prev => prev.map(s => 
            s.id === formData.location 
            ? { ...s, status: 'occupied', product: formData.productName } 
            : s
        ));

        alert(`✅ Barang berhasil disimpan di Rak ${formData.location}`);
        
        // Reset Form
        setFormData({
            qcNumber: '',
            productName: '',
            quantity: '',
            location: '',
            notes: ''
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <PackageCheck className="h-8 w-8 text-blue-600" />
                Storage Management (Putaway)
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* KIRI: FORM */}
                <div className="xl:col-span-1 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>📝 Input Barang Masuk</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField label="Referensi QC Number">
                                <Input 
                                    placeholder="No QC..." 
                                    value={formData.qcNumber} 
                                    onChange={(e) => handleChange('qcNumber', e.target.value)} 
                                />
                            </FormField>

                            <FormField label="Product Name" required>
                                <Select value={formData.productName} onValueChange={(val) => handleChange('productName', val)}>
                                    <SelectTrigger><SelectValue placeholder="Pilih Produk" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PRO-5G-RT">Wireless Router 5G-PRO</SelectItem>
                                        <SelectItem value="SW-24P-V2">Network Switch 24 Port</SelectItem>
                                        <SelectItem value="PA-12V-001">Power Adapter 12V</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>

                            <FormField label="Quantity" required>
                                <Input 
                                    type="number" placeholder="0" 
                                    value={formData.quantity} 
                                    onChange={(e) => handleChange('quantity', e.target.value)} 
                                />
                            </FormField>

                            <FormField label="Location" required infoText>
                                <div className="flex gap-2">
                                    <Input 
                                        value={formData.location} readOnly 
                                        placeholder="Pilih di peta..." 
                                        className="bg-blue-50 text-blue-700 font-bold" 
                                    />
                                    <Button variant="outline" size="icon" className="shrink-0"><MapPin className="h-4 w-4" /></Button>
                                </div>
                            </FormField>

                            <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 font-bold mt-4">
                                Simpan ke Lokasi
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* KANAN: MAP SIMULASI */}
                <div className="xl:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                🏭 Denah Gudang
                                <div className="flex gap-3 text-xs font-normal">
                                    <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 border-green-300 border rounded"></span> Kosong</div>
                                    <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 border-red-300 border rounded"></span> Terisi</div>
                                    <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 border-blue-600 border rounded"></span> Dipilih</div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto pb-4">
                                <div className="min-w-[600px] flex gap-4 justify-center p-2">
                                    {ROWS.map((row) => (
                                        <div key={row} className="flex flex-col gap-2">
                                            <div className="text-center font-bold text-gray-500 bg-gray-100 rounded py-1 mb-1">
                                                ROW {row}
                                            </div>
                                            {LEVELS.map((level) => {
                                                const slotId = `${row}-0${level}`;
                                                const slotData = warehouse.find(s => s.id === slotId);
                                                const status = slotData?.status || 'empty';

                                                return (
                                                    <button
                                                        key={slotId}
                                                        onClick={() => handleSlotClick(slotId)}
                                                        disabled={status === 'occupied'}
                                                        className={`
                                                            w-24 h-16 border-2 rounded-lg flex flex-col items-center justify-center transition-all relative group
                                                            ${status === 'empty' ? 'bg-green-50 border-green-200 hover:bg-green-100 hover:scale-105' : ''}
                                                            ${status === 'occupied' ? 'bg-red-50 border-red-200 opacity-90 cursor-not-allowed' : ''}
                                                            ${status === 'selected' ? 'bg-blue-500 border-blue-600 text-white scale-110 z-10 shadow-lg' : ''}
                                                        `}
                                                    >
                                                        <span className={`text-xs font-bold ${status === 'selected' ? 'text-white' : 'text-gray-600'}`}>{slotId}</span>
                                                        {status === 'occupied' && <Box className="w-5 h-5 text-red-400 mt-1" />}
                                                        {status === 'empty' && <span className="text-[10px] text-green-600">Empty</span>}
                                                        
                                                        {/* Tooltip saat hover slot terisi */}
                                                        {status === 'occupied' && (
                                                            <div className="absolute hidden group-hover:block bottom-full mb-1 bg-black text-white text-[10px] p-2 rounded w-max z-20">
                                                                {slotData?.product}
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Helper Component
function FormField({ label, children, required, infoText }: { label: string, children: React.ReactNode, required?: boolean, infoText?: boolean }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-1">
                <Label>{label}</Label>
                {required && <span className="text-red-500">*</span>}
                {infoText && <span className="text-gray-400 cursor-help" title="Info">ⓘ</span>}
            </div>
            {children}
        </div>
    );
}