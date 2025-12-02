'use client'

import React, { useState, useEffect } from 'react';
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

// Fungsi untuk menghasilkan nomor dokumen Pengecekan Kualitas (QC)
const generateQCReportNumber = () => {
    // Format yang Diinginkan: QC-DDMMYY-XXX
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // YY
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // MM
    const day = date.getDate().toString().padStart(2, '0'); // DD
    
    // Perubahan ada di sini: urutan menjadi DDMMYY
    const formattedDate = `${day}${month}${year}`; 
    
    // Simulasi Counter
    const counter = 1; 
    const sequenceNumber = counter.toString().padStart(3, '0')
    
    return `QC${formattedDate}${sequenceNumber}`;
};

export default function FinishGoodsCheckPage() {
    // State untuk menyimpan Nomor Dokumen Pengecekan
    const [qcNumber, setQcNumber] = useState('Generating...');
    
    // State untuk menyimpan input form lainnya (simulasi)
    const [formData, setFormData] = useState({
        poNumber: '',
        productCode: '',
        checkedQuantity: '',
        result: '', // OK / REJECT
        checkerName: '',
        notes: '',
    });

    // useEffect untuk menghasilkan/mengambil Nomor Dokumen saat komponen dimuat
    useEffect(() => {
        const timer = setTimeout(() => {
            const newNumber = generateQCReportNumber();
            setQcNumber(newNumber);
        }, 500); // Simulasi delay jaringan

        return () => clearTimeout(timer);
    }, []);

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log("Submitting Finish Goods Check Report:", {
            qcNumber,
            ...formData,
        });
        // Di sini Anda akan menambahkan logika fetch() ke API backend
        alert(`Laporan QC ${qcNumber} berhasil disubmit!`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto p-8">
                <h1 className="text-2xl font-semibold mb-6">📝 Finish Goods Quality Check</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column (Identification) */}
                    <div className="space-y-6">
                        {/* Nomor Dokumen QC (Otomatis) */}
                        <FormField label="QC Document Number" infoText>
                            <Input
                                value={qcNumber}
                                readOnly // Harus Read-Only
                                placeholder="Generating..."
                            />
                        </FormField>

                        {/* Nomor Purchase Order */}
                        <FormField label="Work Order (WO) Number" required>
                            <Input
                                placeholder="..."
                                value={formData.poNumber}
                                onChange={(e) => handleChange('poNumber', e.target.value)}
                            />
                        </FormField>

                        {/* Kode Produk */}
                        <FormField label="Part Number" required>
                            <Input
                                placeholder="..."
                                value={formData.productCode}
                                onChange={(e) => handleChange('productCode', e.target.value)}
                            />
                        </FormField>
                        
                        {/* Nama Petugas Pengecek */}
                        <FormField label="Checker Name" required>
                            <Input
                                placeholder="Masukkan Nama Petugas"
                                value={formData.checkerName}
                                onChange={(e) => handleChange('checkerName', e.target.value)}
                            />
                        </FormField>
                    </div>

                    {/* Right Column (Results) */}
                    <div className="space-y-6">
                        {/* Kuantitas yang Dicek */}
                        <FormField label="Checked Quantity" required>
                            <Input
                                type="number"
                                placeholder="Jumlah unit yang dicek"
                                value={formData.checkedQuantity}
                                onChange={(e) => handleChange('checkedQuantity', e.target.value)}
                            />
                        </FormField>

                        {/* Hasil Pengecekan (Select) */}
                        <FormField label="Inspection Result" required>
                            <Select
                                value={formData.result}
                                onValueChange={(value) => handleChange('result', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Hasil: LULUS atau GAGAL" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OK">✅ OK (Passed)</SelectItem>
                                    <SelectItem value="REJECT">❌ REJECT (Failed)</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>

                        {/* Catatan / Keterangan */}
                        <FormField label="Notes / Remarks">
                            <Textarea
                                placeholder="Tuliskan cacat yang ditemukan atau keterangan tambahan."
                                value={formData.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                            />
                        </FormField>
                    </div>
                </div>

                {/* --- Submit Button --- */}
                <div className="mt-8 pt-6 border-t flex justify-end">
                    <Button 
                        onClick={handleSubmit} 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                    >
                        Submit QC Report
                    </Button>
                </div>
            </main>
        </div>
    );
}

// --- Reusable Form Field Component (Sama seperti yang Anda berikan) ---

interface FormFieldProps {
    label: string;
    children: React.ReactNode;
    required?: boolean;
    infoText?: boolean; // For the circle-i icon
}

function FormField({ label, children, required, infoText }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-1">
                <Label htmlFor={label.toLowerCase().replace(/\s/g, '-')}>
                    {label}
                </Label>
                {required && <span className="text-red-500">*</span>}
                {infoText && (
                    <span className="text-gray-400" title="Informational field">
                        ⓘ
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}