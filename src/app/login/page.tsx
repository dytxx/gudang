'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            // Ganti URL dengan endpoint API Anda
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const result = await res.json();

            if (res.ok) {
                // 1. Simpan data ke LocalStorage
                localStorage.setItem('user_role', result.data.role);
                localStorage.setItem('user_name', result.data.username);
                
                // 2. KIRIM SINYAL KE NAVBAR (INI KUNCINYA)
                window.dispatchEvent(new Event('login-success'));

                alert(`Selamat datang, ${result.data.role}`);
                router.push('/'); 
            } else {
                alert("Login Gagal: " + (result.message || "Cek username/password"));
            }
        } catch (e) {
            alert("Gagal koneksi server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-[400px] shadow-xl">
                <CardHeader className="bg-blue-600 text-white rounded-t-lg text-center">
                    <div className="flex justify-center mb-2"><Lock className="w-8 h-8"/></div>
                    <CardTitle>WMS Login System</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Username</label>
                        <Input onChange={(e) => setForm({...form, username: e.target.value})} placeholder="admin / operator / qc / manager" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Password</label>
                        <Input type="password" onChange={(e) => setForm({...form, password: e.target.value})} placeholder="******" />
                    </div>
                    <Button onClick={handleLogin} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 font-bold mt-4">
                        {loading ? 'Logging in...' : 'MASUK'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}