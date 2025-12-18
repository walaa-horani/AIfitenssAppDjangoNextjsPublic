"use client";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Sidebar from "./Sidebar";

export default function Navbar() {
  return (
    <header className="w-full h-16 bg-card border-b border-primary/20 flex items-center px-4 justify-between">
      {/* Mobile Sidebar Trigger */}
      <div className="flex items-center gap-3 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6 text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-card">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Logo */}
      <Link href="/dashboard" className="text-xl pb-3 font-bold bg-linear-to-r from-primary to-glow-strong bg-clip-text text-transparent">
       <Image alt="image" className="w-[130px]" width={100} height={100} src="/logo.png"/>
      </Link>

      {/* User Avatar */}
      <div className="flex items-center gap-3">
        <Avatar className="border border-primary/40 shadow-md">
          <AvatarImage />
          <AvatarFallback><Image alt="avatar" width={130} height={130} src="/avatar.jpg"/></AvatarFallback>
        </Avatar>
      </div> 
    </header>
  );
}