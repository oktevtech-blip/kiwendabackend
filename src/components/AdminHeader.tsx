'use client';

import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/UserNav';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { navLinks } from './NavItems';

function getPageTitle(pathname: string) {
    if (pathname === '/dashboard') return 'Dashboard Overview';
    const link = navLinks.find(l => pathname.startsWith(l.href) && l.href !== '/');
    if (link) return link.label;
    if (pathname.startsWith('/settings')) return 'Settings';
    if (pathname.startsWith('/users')) return 'Admin Accounts';
    return 'Dashboard';
}

export default function AdminHeader() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  
  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6",
      isMobile ? "" : "peer-data-[variant=inset]:border-none"
    )}>
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-lg font-bold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <UserNav />
      </div>
    </header>
  );
}
