import React from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Settings,
  Users,
} from 'lucide-react';

import AdminHeader from '@/components/AdminHeader';
import { NavItems } from '@/components/NavItems';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Button asChild variant="ghost" className="h-auto w-full justify-start px-2 py-1">
            <Link href="/dashboard" className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
  <Image
    src="/kiwenda.png"
    alt="Kiwenda Logo"
    width={48}
    height={48}
    className="object-cover"
  />
</div>
              <span className="font-headline text-xl font-bold text-sidebar-foreground">Kiwenda</span>
            </Link>
          </Button>
        </SidebarHeader>

        <SidebarContent>
          <NavItems />
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Admin Accounts">
                <Link href="/users">
                  <Users />
                  <span>Admin Accounts</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
