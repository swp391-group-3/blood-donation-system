'use client';

import { MenuIcon } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { Role } from '@/lib/api/dto/account';
import { useCurrentAccount } from '@/hooks/use-current-account';
import { useMemo } from 'react';
import { AccountIndicator, MobileAccountIndicator } from './account-indicator';

interface MenuItem {
    title: string;
    href: string;
    subItems?: {
        title: string;
        href: string;
    }[];
}

const getMenuItems = (role?: Role): MenuItem[] => {
    switch (role) {
        case 'staff':
            return [];
        case 'admin':
            return [];
        default:
            return [
                {
                    title: 'Home',
                    href: '/',
                },
                {
                    title: 'Blood Request',
                    href: '/request',
                },
                {
                    title: 'Blog',
                    href: '/blog',
                },
            ];
    }
};

const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
            <span className="text-lg font-semibold tracking-tighter">
                Blood Donation System
            </span>
        </Link>
    );
};

const NavigationItem = ({ title, href, subItems }: MenuItem) => {
    if (!subItems) {
        return (
            <NavigationMenuItem>
                <NavigationMenuLink
                    href={href}
                    className={navigationMenuTriggerStyle()}
                >
                    {title}
                </NavigationMenuLink>
            </NavigationMenuItem>
        );
    }
    return (
        <NavigationMenuItem>
            <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
            <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 p-3">
                    {subItems.map((subItem, index) => (
                        <NavigationMenuLink
                            href={subItem.href}
                            key={index}
                            className="rounded-md p-3 transition-colors hover:bg-muted/70"
                        >
                            <p className="mb-1 font-semibold text-foreground">
                                {subItem.title}
                            </p>
                        </NavigationMenuLink>
                    ))}
                </div>
            </NavigationMenuContent>
        </NavigationMenuItem>
    );
};

const MobileNavigationItem = ({ title, href, subItems }: MenuItem) => {
    if (!subItems) {
        return (
            <Link href={href} className="font-medium">
                {title}
            </Link>
        );
    }
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="solutions" className="border-none">
                <AccordionTrigger className="text-base hover:no-underline">
                    {title}
                </AccordionTrigger>
                <AccordionContent>
                    <div className="grid md:grid-cols-2">
                        {subItems.map((subItem, index) => (
                            <Link
                                href={subItem.href}
                                key={index}
                                className="rounded-md p-3 transition-colors hover:bg-muted/70"
                            >
                                <p className="mb-1 font-semibold text-foreground">
                                    {subItem.title}
                                </p>
                            </Link>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export const Header = () => {
    const { data: account } = useCurrentAccount();
    const menuItems = useMemo(() => getMenuItems(account?.role), [account]);

    return (
        <header className="m-5">
            <nav className="flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
                <Logo />
                <NavigationMenu className="hidden md:block">
                    <NavigationMenuList>
                        {menuItems.map((item, index) => (
                            <NavigationItem key={index} {...item} />
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="justify-self-end hidden md:block">
                    <AccountIndicator />
                </div>
                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="outline" size="icon">
                            <MenuIcon className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="top"
                        className="max-h-screen overflow-auto"
                    >
                        <SheetHeader>
                            <SheetTitle>
                                <Logo />
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col p-4">
                            <div className="flex flex-col gap-6">
                                {menuItems.map((item, index) => (
                                    <MobileNavigationItem
                                        key={index}
                                        {...item}
                                    />
                                ))}
                            </div>
                            <MobileAccountIndicator />
                        </div>
                    </SheetContent>
                </Sheet>
            </nav>
        </header>
    );
};
