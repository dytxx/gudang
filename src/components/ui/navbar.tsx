'use client'

import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";




const Navbar = () => {
    return (
        <header className="flex h-20 w-full shrink-0 sticky top-0 z-10 items-center px-4 md:px-10 bg-white">
            <Link href="/" className="mr-10 hidden lg:flex" prefetch={false}>
                <span className="self-center text-2xl font-semibold whitespace-nowrap">
                    Warehouse
                </span>
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger className="mr-200">Menu</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                        <DropdownMenuItem><Link href="/WO">Work Order</Link></DropdownMenuItem>   
                        <DropdownMenuItem><Link href="/FG">Finish Goods</Link></DropdownMenuItem> 
                        <DropdownMenuItem><Link href="/stock">Stock</Link></DropdownMenuItem>
                        <DropdownMenuItem><Link href="/Delivery">Delivery</Link></DropdownMenuItem>          
                        <DropdownMenuItem><Link href="/Storage">Storage</Link></DropdownMenuItem>  
                            </DropdownMenuContent>
                            </DropdownMenu>
            <nav className="mx-auto hidden lg:flex items-center justify-end gap-6">
                <Link
                    href="/"
                    className="group inline-flex h-9 w-max items-center font-semibold justify-center px-4 py-2 hover:text-redplt transition-transform duration-300 ease-in-out hover:scale-105"
                    prefetch={false}
                >
                    Home
                </Link>
                <Link
                    href="#"
                    className="group inline-flex h-9 w-max items-center font-semibold justify-center px-4 py-2 hover:text-redplt transition-transform duration-300 ease-in-out hover:scale-105"
                    prefetch={false}
                >
                    <DropdownMenu>
                            <DropdownMenuTrigger>Profile</DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem><Link href="/login">Login</Link></DropdownMenuItem>
                                
                            </DropdownMenuContent>
                            </DropdownMenu>
                </Link>
            </nav>
           
         

        </header>
    )
}

export default Navbar;
