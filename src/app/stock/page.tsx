'use client'

import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Edit, Trash2, Loader2, Save } from 'lucide-react';

export default function StockPage() {
    const [stocks, setStocks] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // State untuk Edit/Delete
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    // --- 1. FETCH DATA (READ) ---
    const fetchStocks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/storage');
            const data = await res.json();
            // Jika return object (kunci ID), ubah jadi array
            const arr = Array.isArray(data) ? data : Object.values(data);
            setStocks(arr);
        } catch (e) { console.error(e); } 
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchStocks(); }, []);

    // --- 2. DELETE HANDLER ---
    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus barang ini?")) return;

        try {
            const res = await fetch(`http://localhost:8080/api/storage/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                alert("✅ Data dihapus!");
                fetchStocks(); // Refresh tabel
            } else {
                alert("❌ Gagal menghapus");
            }
        } catch (e) { alert("Error koneksi"); }
    };

    // --- 3. UPDATE HANDLER ---
    const openEditModal = (item: any) => {
        setEditData({ ...item }); // Copy object agar tidak mutasi langsung
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editData) return;

        try {
            const res = await fetch(`http://localhost:8080/api/storage/${editData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editData.name,
                    quantity: editData.quantity,
                    location: editData.location
                }),
            });
            
            if (res.ok) {
                alert("✅ Data berhasil diupdate!");
                setIsEditDialogOpen(false);
                fetchStocks();
            } else {
                alert("❌ Gagal update");
            }
        } catch (e) { alert("Error koneksi"); }
    };

    // Filter Pencarian
    const filtered = stocks.filter(item => 
        (item.name?.toLowerCase() || '').includes(search.toLowerCase()) || 
        (item.sku?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (item.fg_number?.toLowerCase() || '').includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <main className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        📦 Manajemen Stok Gudang
                    </h1>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input 
                            placeholder="Cari FG ID, Produk..." 
                            className="pl-8 bg-white" 
                            onChange={(e) => setSearch(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-100">
                            <TableRow>
                                <TableHead className="w-[120px]">FG Number</TableHead>
                                <TableHead>Produk</TableHead>
                                <TableHead>Lokasi</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead className="text-center w-[150px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={5} className="text-center h-24"><Loader2 className="animate-spin inline mr-2"/> Loading...</TableCell></TableRow>
                            ) : filtered.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="text-center h-24 text-gray-500">Data tidak ditemukan.</TableCell></TableRow>
                            ) : (
                                filtered.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-mono font-bold text-blue-600 text-xs">{item.fg_number || '-'}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-xs text-gray-400">{item.sku}</div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold border border-green-200">
                                                {item.location}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-bold">{item.quantity}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => openEditModal(item)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* --- MODAL EDIT --- */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Data Barang</DialogTitle>
                        </DialogHeader>
                        {editData && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">FG Number</Label>
                                    <Input value={editData.fg_number} disabled className="col-span-3 bg-gray-100" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Nama</Label>
                                    <Input 
                                        value={editData.name} 
                                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                                        className="col-span-3" 
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Qty</Label>
                                    <Input 
                                        type="number"
                                        value={editData.quantity} 
                                        onChange={(e) => setEditData({...editData, quantity: e.target.value})}
                                        className="col-span-3" 
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Lokasi</Label>
                                    <Input 
                                        value={editData.location} 
                                        onChange={(e) => setEditData({...editData, location: e.target.value})}
                                        className="col-span-3" 
                                    />
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
                            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                                <Save className="w-4 h-4 mr-2"/> Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}