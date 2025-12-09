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

export default function WorkOrderPage() {
    // 1. STATE DEFINITIONS
    const [woNumber, setWoNumber] = useState('Generating...');
    
    const [formData, setFormData] = useState({
        customer: '',
        projectName: '',
        partNumber: '',
        quantity: '',
        remarks: '',
    });

    // 2. FETCH NOMOR OTOMATIS DARI BACKEND
    const fetchWONumber = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/wo/generate-number');
            const data = await res.json();
            if (data && data.woNumber) {
                setWoNumber(data.woNumber);
            }
        } catch (error) {
            console.error("Gagal koneksi ke backend:", error);
            setWoNumber("Error-Connection");
        }
    };

    useEffect(() => {
        fetchWONumber();
    }, []);

    // Helper update state form
    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. FUNGSI SUBMIT
    const handleSubmit = async () => {
        // Validasi wajib
        if (!formData.customer || !formData.projectName || !formData.partNumber || !formData.quantity) {
            alert("Mohon lengkapi semua data wajib (*)!");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/wo/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    woNumber: woNumber,
                    customer: formData.customer,
                    projectName: formData.projectName,
                    partNumber: formData.partNumber,
                    quantity: formData.quantity,
                    remarks: formData.remarks
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert("✅ Sukses: " + data.message);
                
                // Reset form
                setFormData({
                    customer: '',
                    projectName: '',
                    partNumber: '',
                    quantity: '',
                    remarks: '',
                });
                
                // Generate nomor baru
                setWoNumber("Updating...");
                fetchWONumber();
            } else {
                alert("❌ Gagal menyimpan data.");
            }
        } catch (error) {
            alert("❌ Terjadi kesalahan jaringan.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto p-8">
                <h1 className="text-2xl font-semibold mb-6">Create New Work Order</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <FormField label="Customer" required>
                            <Select 
                                value={formData.customer}
                                onValueChange={(val) => handleChange('customer', val)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PT. TELEKOMUNIKASI INDONESIA">PT. TELEKOMUNIKASI INDONESIA</SelectItem>
                                    <SelectItem value="PT. MITRA TELEKOMUNIKASI INDONESIA">PT. MITRA TELEKOMUNIKASI INDONESIA</SelectItem>
                                    <SelectItem value="PT. ICON PLUS INDONESIA">PT. ICON PLUS INDONESIA</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label="Work Order Number" infoText>
                            <Input
                                value={woNumber} 
                                readOnly 
                                className="bg-gray-100 font-bold"
                            />
                        </FormField>

                        <FormField label="Remarks">
                            <Textarea 
                                placeholder="Keterangan tambahan..." 
                                value={formData.remarks}
                                onChange={(e) => handleChange('remarks', e.target.value)}
                            />
                        </FormField>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <FormField label="Project Name" required>
                            <Input
                                placeholder="Nama Pekerjaan"
                                value={formData.projectName}
                                onChange={(e) => handleChange('projectName', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Part Number" required>
                            <Select 
                                value={formData.partNumber}
                                onValueChange={(val) => handleChange('partNumber', val)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Part Number" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SYSTEM 1">SYSTEM 1</SelectItem>
                                    <SelectItem value="SYSTEM 2">SYSTEM 2</SelectItem>
                                    <SelectItem value="SYSTEM 3">SYSTEM 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label="Work Quantity" required>
                            <Input
                                type="number"
                                placeholder="Jumlah"
                                value={formData.quantity}
                                onChange={(e) => handleChange('quantity', e.target.value)}
                            />
                        </FormField>
                    </div>
                </div>

                {/* --- Action Section --- */}
                <div className="mt-8 pt-6 border-t flex justify-end">
                    <Button 
                        onClick={handleSubmit}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded"
                    >
                        Confirm Work Order
                    </Button>
                </div>
            </main>
        </div>
    );
}

// --- Reusable Component ---
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
        <Label htmlFor={label.toLowerCase().replace(/\s/g, '-')}>
          {label}
        </Label>
        {required && <span className="text-red-500">*</span>}
        {infoText && (
          <span className="text-gray-400 cursor-help" title="Auto-generated by system">
            ⓘ
          </span>
        )}
      </div>
      {children}
    </div>
  );
}