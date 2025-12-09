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

// Definisi Tipe Data untuk Work Order
type WorkOrder = {
    id: number;
    wo_number: string;
    part_number: string;
    target_qty: number;
    remaining_qty: number; // Sisa Qty dari backend
}

export default function FinishGoodsCheckPage() {
    // --- STATE DEFINITIONS ---
    const [qcNumber, setQcNumber] = useState('Generating...');
    const [woList, setWoList] = useState<WorkOrder[]>([]);
    
    // State untuk menyimpan data WO yang sedang dipilih (untuk validasi sisa)
    const [selectedWOData, setSelectedWOData] = useState<WorkOrder | null>(null);

    const [formData, setFormData] = useState({
        poNumber: '',
        productCode: '',
        checkedQuantity: '',
        result: '', 
        checkerName: '',
        notes: '',
    });

    // --- FETCH DATA FUNCTIONS ---
    
    // 1. Ambil Nomor QC Baru
    const fetchQCNumber = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/qc/generate-number');
            const data = await res.json();
            if (data.qcNumber) setQcNumber(data.qcNumber);
        } catch (error) {
            console.error("Gagal ambil QC Number", error);
        }
    };

    // 2. Ambil List WO (untuk Dropdown)
    const fetchWOList = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/wo');
            const data = await res.json();
            if (Array.isArray(data)) {
                setWoList(data);
            } else {
                setWoList([]); 
            }
        } catch (error) {
            console.error("Gagal ambil list WO", error);
        }
    };

    // Jalankan saat halaman pertama kali dimuat
    useEffect(() => {
        fetchQCNumber();
        fetchWOList();
    }, []);

    // --- EVENT HANDLERS ---

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler Khusus saat WO Dipilih
    const handleWOChange = (selectedWO: string) => {
        const foundWO = woList.find(item => item.wo_number === selectedWO) || null;
        setSelectedWOData(foundWO); // Simpan data WO terpilih ke state

        setFormData(prev => ({
            ...prev,
            poNumber: selectedWO,
            productCode: foundWO ? foundWO.part_number : '', // Isi Part Number Otomatis
        }));
    };

    // Handler Submit dengan Validasi Lengkap
    const handleSubmit = async () => {
        // 1. Validasi Wajib Isi
        if (!formData.poNumber || !formData.result || !formData.checkedQuantity || !formData.checkerName) {
            alert("Mohon lengkapi semua data wajib (*)");
            return;
        }

        const inputQty = parseInt(formData.checkedQuantity);

        // 2. Validasi Logika (Cegah Qty Berlebih)
        if (formData.result === 'OK' && selectedWOData) {
            if (inputQty > Number(selectedWOData.remaining_qty)) {
                alert(`⛔ ERROR: Jumlah QC PASS (${inputQty}) melebihi sisa WO (${selectedWOData.remaining_qty})!`);
                return; 
            }
        }

        // 3. Kirim ke Backend
        try {
            const response = await fetch('http://localhost:8080/api/qc/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    qcNumber: qcNumber, 
                    poNumber: formData.poNumber,
                    productCode: formData.productCode,
                    checkedQuantity: inputQty,
                    result: formData.result,
                    checkerName: formData.checkerName, 
                    notes: formData.notes
                }),
            });
    
            const data = await response.json();

            if (response.ok) {
                alert("✅ Sukses: " + data.message);
                
                // Reset Form
                setFormData({
                    poNumber: '',
                    productCode: '',
                    checkedQuantity: '',
                    result: '', 
                    checkerName: '', 
                    notes: '',
                });
                setSelectedWOData(null); // Reset pilihan WO

                // Refresh Data Penting
                setQcNumber("Updating...");
                fetchQCNumber(); 
                fetchWOList(); // Refresh list WO agar sisa qty terupdate

            } else {
                alert("❌ Gagal: " + (data.messages?.error || data.message || "Terjadi kesalahan server"));
            }
        } catch (error) {
            console.error(error);
            alert("❌ Terjadi kesalahan jaringan. Pastikan backend CodeIgniter berjalan.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto p-8">
                <h1 className="text-2xl font-semibold mb-6">📝 Finish Goods Quality Check</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* --- Kolom Kiri (Data Identitas) --- */}
                    <div className="space-y-6">
                        <FormField label="QC Document Number" infoText>
                            <Input value={qcNumber} readOnly className="bg-gray-100 font-bold font-mono" />
                        </FormField>

                        <FormField label="Work Order (WO) Number" required>
                            <Select value={formData.poNumber} onValueChange={handleWOChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Work Order (Sisa Qty)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {woList.length === 0 ? (
                                        <SelectItem value="empty" disabled>Tidak ada WO aktif</SelectItem>
                                    ) : (
                                        woList.map((wo) => (
                                            <SelectItem key={wo.id} value={wo.wo_number}>
                                                <span className="font-medium">{wo.wo_number}</span> 
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label="Part Number" required>
                            <Input 
                                value={formData.productCode} 
                                readOnly 
                                className="bg-gray-100 font-medium" 
                                placeholder="Otomatis terisi..."
                            />
                        </FormField>
                        
                        <FormField label="Checker Name" required>
                            <Input 
                                value={formData.checkerName} 
                                onChange={(e) => handleChange('checkerName', e.target.value)} 
                                placeholder="Masukkan Nama Petugas"
                            />
                        </FormField>
                    </div>

                    {/* --- Kolom Kanan (Hasil Pengecekan) --- */}
                    <div className="space-y-6">
                        <FormField label="Checked Quantity" required>
                            <div className="flex flex-col gap-1">
                                <Input 
                                    type="number" 
                                    placeholder="0" 
                                    value={formData.checkedQuantity}
                                    onChange={(e) => handleChange('checkedQuantity', e.target.value)}
                                    // Visual cue: border merah jika melebihi sisa
                                    className={
                                        selectedWOData && formData.result === 'OK' && Number(formData.checkedQuantity) > selectedWOData.remaining_qty
                                        ? "border-red-500 focus-visible:ring-red-500 bg-red-50" 
                                        : ""
                                    }
                                />
                                {selectedWOData && (
                                    <p className="text-xs text-blue-600">
                                        Maksimal Input: <b>{selectedWOData.remaining_qty}</b>
                                    </p>
                                )}
                            </div>
                        </FormField>

                        <FormField label="Inspection Result" required>
                            <Select value={formData.result} onValueChange={(value) => handleChange('result', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Hasil" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OK">✅ OK (Passed)</SelectItem>
                                    <SelectItem value="REJECT">❌ REJECT (Failed)</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label="Notes / Remarks">
                            <Textarea 
                                value={formData.notes} 
                                onChange={(e) => handleChange('notes', e.target.value)} 
                                placeholder="Catatan tambahan..."
                            />
                        </FormField>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t flex justify-end">
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
                        Submit QC Report
                    </Button>
                </div>
            </main>
        </div>
    );
}

// --- Komponen Reusable ---
interface FormFieldProps {
    label: string;
    children: React.ReactNode;
    required?: boolean;
    infoText?: boolean;
}

function FormField({ label, children, required, infoText }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-1">
                <Label htmlFor={label.toLowerCase().replace(/\s/g, '-')}>{label}</Label>
                {required && <span className="text-red-500">*</span>}
                {infoText && <span className="text-gray-400 cursor-help" title="Info">ⓘ</span>}
            </div>
            {children}
        </div>
    );
}