'use client';
import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Calendar, Heart, Home, Inbox, Search, Settings } from "lucide-react"
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

const items = [
    {
        title: "Home",
        url: "/admin",
        icon: Home,
    },
    {
        title: "Staff",
        url: "/admin/staff",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    // {
    //     title: "Search",
    //     url: "#",
    //     icon: Search,
    // },
    // {
    //     title: "Settings",
    //     url: "#",
    //     icon: Settings,
    // },
]

function AppSidebar() {
    const pathName = usePathname();

    console.log(pathName);


    return (
        <Sidebar className='flex bg-gray-50'>
            <SidebarHeader className="sticky top-0 h-dvd bg-white border-zinc-300 flex flex-col">
                <div className='flex items-center space-x-2 mt-3 mb-3'>
                    <Heart className="h-6 w-6 text-red-600" />
                    <span className='text-xl font-bold text-zinc-950'>
                        Admin Dashboard
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroupContent className='px-3.5'>
                    <SidebarMenu>
                        {items.map((item, index) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Button
                                        asChild
                                        key={index}
                                        variant="ghost"
                                        className={cn(
                                            'w-full justify-start text-zinc-600 hover:text-zinc-900 hover:bg-gray-200 py-4.5 my-0.5 transition',
                                            pathName === item.url &&
                                            'bg-red-50 text-red-600 hover:bg-red-100 hover:shadow',
                                        )}
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            {item.title}
                                        </Link>
                                    </Button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarContent>
        </Sidebar>
    )

}



function layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                {children}
            </main>
        </SidebarProvider>
    )
}

export default layout