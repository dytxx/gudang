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

const generateWorkOrderNumber = () => {
    // Simulasi format Work Order: WO-YYYYMMDD-XXXX
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0'); 
    const formattedDate = `${year}${month}${day}`;
    const counter = 1; 
    const sequenceNumber = counter.toString().padStart(4, '0')
    
    return `WO${formattedDate}${sequenceNumber}`;
};

export default function WorkOrderPage() {
    // 1. Tambahkan state untuk Work Order Number
    const [workOrderNumber, setWorkOrderNumber] = useState('Generating...');
    
    // 2. Gunakan useEffect untuk membuat atau mengambil nomor saat komponen dimuat
    useEffect(() => {
        // Simulasi fetching dari API/backend
        // Di aplikasi nyata, Anda akan menggunakan fetch() atau library seperti axios di sini.
        const timer = setTimeout(() => {
            const newNumber = generateWorkOrderNumber();
            setWorkOrderNumber(newNumber);
        }, 500); // Simulasi delay jaringan 500ms

        // Cleanup function jika komponen dilepas sebelum selesai
        return () => clearTimeout(timer);
    }, []); // Array dependensi kosong agar hanya berjalan sekali saat mount

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Main Form Content --- */}
      <main className="container mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-6">Create New Work Order</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <FormField label="Customer" required>
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Customer" />
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
                // 3. Set nilai Input dari state workOrderNumber
                   value={workOrderNumber} 
                   readOnly // Nomor ini harus read-only (tidak bisa diubah pengguna)
                   placeholder="Generating..."
                />
            </FormField>

            <FormField label="Remarks">
              <Textarea placeholder="-" />
            </FormField>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <FormField label="Name" required>
              <Input
                placeholder="Nama Pekerjaan"
              />
            </FormField>
            <FormField label="Part Number" required>
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Customer" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="SYSTEM 1">SYSTEM 1</SelectItem>
                    <SelectItem value="SYSTEM 2">SYSTEM 2</SelectItem>
                    <SelectItem value="SYSTEM 2">SYSTEM 3</SelectItem>
                </SelectContent>
            </Select>
            </FormField>
            <FormField label="Work Quantity" required>
              {/* Using shadcn/ui Select component */}
              <Input
                placeholder="Quantity"
              />
            </FormField>
          </div>
        </div>

        {/* --- Add Detail Button (Action section) --- */}
        <div className="mt-8 pt-6 border-t">
          <Button className="bg-red-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Confirm
          </Button>
        </div>
      </main>
    </div>
  );
}

// --- Reusable Form Field Component ---
// This helps structure the Label and Input consistently.

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  infoText?: boolean; // For the circle-i icon shown next to 'Doc Number'
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