'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Image as ImageIcon,
  Newspaper,
  BookUser,
  Star,
  MessagesSquare,
  CalendarDays,
} from 'lucide-react';
import Link from 'next/link';

export const navLinks = [
  { href: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
  { href: '/services', icon: <Briefcase />, label: 'Services' },
  // { href: '/pages', icon: <FileText />, label: 'Manage Pages' },
  { href: '/gallery', icon: <ImageIcon />, label: 'Image Gallery' },
  { href: '/hero', icon: <ImageIcon />, label: 'Hero Image' },
  { href: '/appointments', icon: <CalendarDays />, label: 'Appointments' },
  // { href: '/resources', icon: <BookUser />, label: 'Patient Resources' },
  { href: '/testimonials', icon: <Star />, label: 'Testimonials' },
  { href: '/messages', icon: <MessagesSquare />, label: 'Messages' },
];

export function NavItems() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navLinks.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
            tooltip={item.label}
          >
            <Link href={item.href}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
