'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
    LogOut, 
    LayoutDashboard, // Dashboard
    ClipboardList,   // WO
    ShieldCheck,     // QC
    Warehouse,       // Storage
    Truck,           // Delivery
    Boxes,           // Stock
    Users,           // User Management
    Menu             // Icon Menu Hamburger
} from "lucide-react"

const Navbar = () => {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    // FUNGSI UNTUK CEK STATUS LOGIN
    const checkLoginStatus = () => {
        const r = localStorage.getItem('user_role');
        const u = localStorage.getItem('user_name');
        setRole(r);
        setUsername(u);
    };

    useEffect(() => {
        checkLoginStatus();
        const handleLoginEvent = () => checkLoginStatus();
        window.addEventListener('login-success', handleLoginEvent);
        return () => {
            window.removeEventListener('login-success', handleLoginEvent);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setRole(null);
        setUsername(null);
        router.push('/login');
    }

    // KONFIGURASI MENU & IKON
    const menus = [
        { 
            label: "Dashboard", 
            href: "/dashboard", 
            allowed: ['admin', 'manager', 'superuser'],
            icon: <LayoutDashboard className="w-4 h-4 mr-2"/> 
        },
        { 
            label: "Work Order", 
            href: "/WO", 
            allowed: ['admin', 'superuser'],
            icon: <ClipboardList className="w-4 h-4 mr-2 text-blue-600"/> 
        },
        { 
            label: "QC Check", 
            href: "/FG", 
            allowed: ['admin', 'qc', 'superuser'],
            icon: <ShieldCheck className="w-4 h-4 mr-2 text-green-600"/> 
        },
        { 
            label: "Storage", 
            href: "/Storage", 
            allowed: ['admin', 'operator', 'superuser'],
            icon: <Warehouse className="w-4 h-4 mr-2 text-purple-600"/> 
        },
        { 
            label: "Delivery Order", 
            href: "/Delivery", 
            allowed: ['admin', 'operator', 'superuser'],
            icon: <Truck className="w-4 h-4 mr-2 text-orange-600"/> 
        },
        { 
            label: "Stock Monitor", 
            href: "/stock", 
            allowed: ['admin', 'manager', 'operator', 'superuser'],
            icon: <Boxes className="w-4 h-4 mr-2 text-slate-600"/> 
        },
        { 
            label: "User Management", 
            href: "/users", 
            allowed: ['superuser'],
            icon: <Users className="w-4 h-4 mr-2 text-red-600"/> 
        }, 
    ];
    
    return (
        <header className="flex h-20 w-full shrink-0 sticky top-0 z-50 items-center px-4 md:px-10 bg-white border-b shadow-sm justify-between">
            <Link href="/" className="font-bold text-2xl text-blue-700 flex items-center gap-2">
                WMSystem 
                {role && <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600 font-normal uppercase">{role}</span>}
            </Link>
            
            <div className="flex items-center gap-4">
                {role ? (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="px-6 py-2 border rounded-md hover:bg-gray-50 font-medium flex items-center gap-2 bg-blue-50 text-blue-800 border-blue-200 transition-colors">
                                <Menu className="w-5 h-5"/> Menu Aplikasi ▼
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-60 p-2">
                                {menus.map((menu, idx) => {
                                    if (role && menu.allowed.includes(role)) {
                                        return (
                                            <DropdownMenuItem key={idx} asChild>
                                                <Link href={menu.href} className="w-full cursor-pointer flex items-center py-2.5 px-2 font-medium">
                                                    {menu.icon}
                                                    {menu.label}
                                                </Link>
                                            </DropdownMenuItem>
                                        )
                                    }
                                    return null;
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex items-center gap-3">
                             <div className="text-right hidden md:block">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Logged in as</p>
                                <p className="font-bold text-sm text-gray-800">{username}</p>
                            </div>
                            <button onClick={handleLogout} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors border border-red-100" title="Logout">
                                <LogOut className="w-5 h-5"/>
                            </button>
                        </div>
                    </>
                ) : (
                    <Link href="/login" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold transition-all shadow-md hover:shadow-lg">
                        Login Portal
                    </Link>
                )}
            </div>
        </header>
    )
}

export default Navbar;