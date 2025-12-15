'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, UserPlus, ShieldAlert } from 'lucide-react';

export default function UserManagementPage() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: '' });

    // Proteksi Halaman
    useEffect(() => {
        const role = localStorage.getItem('user_role');
        if (role !== 'superuser') {
            alert("AKSES DITOLAK: Halaman ini khusus Super User!");
            router.push('/');
        }
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await fetch('http://localhost:8080/api/users');
        const data = await res.json();
        setUsers(data);
    };

    const handleAddUser = async () => {
        if (!newUser.username || !newUser.password || !newUser.role) return alert("Lengkapi data!");

        await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        
        alert("User berhasil dibuat!");
        setNewUser({ username: '', password: '', role: '' });
        fetchUsers();
    };

    const handleDelete = async (id: number) => {
        if(!confirm("Hapus user ini?")) return;
        await fetch(`http://localhost:8080/api/users/${id}`, { method: 'DELETE' });
        fetchUsers();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* FORM TAMBAH USER */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader className="bg-slate-800 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5"/> Tambah User
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div>
                            <label className="text-sm font-bold">Username</label>
                            <Input value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-sm font-bold">Password</label>
                            <Input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-sm font-bold">Role Access</label>
                            <Select onValueChange={v => setNewUser({...newUser, role: v})}>
                                <SelectTrigger><SelectValue placeholder="Pilih Role" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin Logistik</SelectItem>
                                    <SelectItem value="qc">Petugas QC</SelectItem>
                                    <SelectItem value="operator">Operator Gudang</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="superuser">Super User</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleAddUser} className="w-full bg-slate-800 hover:bg-slate-700">Buat Akun</Button>
                    </CardContent>
                </Card>

                {/* TABEL LIST USER */}
                <Card className="md:col-span-2">
                    <CardHeader><CardTitle>Daftar Pengguna Sistem</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell>{u.id}</TableCell>
                                        <TableCell className="font-bold">{u.username}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                                ${u.role === 'superuser' ? 'bg-red-100 text-red-800' : 
                                                  u.role === 'manager' ? 'bg-purple-100 text-purple-800' :
                                                  u.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                                            `}>
                                                {u.role}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {u.role !== 'superuser' && (
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(u.id)}>
                                                    <Trash2 className="w-4 h-4"/>
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}