'use client';

import { useState, useEffect, forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import {
    Menu,
    ChevronDown,
    BookOpen,
    Zap,
    Palette,
    AlertCircle,
    Eye,
    BarChart3,
    FileText,
    Layers,
    HelpCircle,
    Database,
    CalendarCheck,
    Users2,
    LucideIcon,
    User,
    Droplets,
    Shield,
    Calendar,
    Home,
    LayoutDashboard,
    FileEdit,
    Activity,
    Package,
    BadgeQuestionMark,
    Droplet,
    UserCog,
    LogOut,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from './logo';
import { useCurrentAccount } from '@/hooks/use-current-account';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { AccountPicture } from './account-picture';
import { AccountOverview } from './account-overview';
import { Role } from '@/lib/api/dto/account';
import { useLogout } from '@/hooks/use-logout';

const gettingStartedItems = [
    {
        title: 'Introduction',
        href: '/docs',
        description:
            'Re-usable components built using Radix UI and Tailwind CSS.',
        icon: BookOpen,
    },
    {
        title: 'Installation',
        href: '/docs/installation',
        description: 'How to install dependencies and structure your app.',
        icon: Zap,
    },
    {
        title: 'Typography',
        href: '/docs/primitives/typography',
        description: 'Styles for headings, paragraphs, lists and more.',
        icon: Palette,
    },
];

const components = [
    {
        title: 'Alert Dialog',
        href: '/docs/primitives/alert-dialog',
        description:
            'A modal dialog that interrupts the user with important content and expects a response.',
        icon: AlertCircle,
    },
    {
        title: 'Hover Card',
        href: '/docs/primitives/hover-card',
        description:
            'For sighted users to preview content available behind a link.',
        icon: Eye,
    },
    {
        title: 'Progress',
        href: '/docs/primitives/progress',
        description:
            'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
        icon: BarChart3,
    },
    {
        title: 'Scroll-area',
        href: '/docs/primitives/scroll-area',
        description: 'Visually or semantically separates content.',
        icon: FileText,
    },
    {
        title: 'Tabs',
        href: '/docs/primitives/tabs',
        description:
            'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
        icon: Layers,
    },
    {
        title: 'Tooltip',
        href: '/docs/primitives/tooltip',
        description:
            'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
        icon: HelpCircle,
    },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: currentAccount } = useCurrentAccount();
    const logout = useLogout();

    const baseLinks = [
        { label: 'Home', href: '/' },
        { label: 'Blood Request', href: '/request' },
        { label: 'Blog', href: '/blog' },
    ];

    const renderLink = (item: { label: string; href: string }) => (
        <NavigationMenuItem key={item.label}>
            <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
            >
                <Link href={item.href}>{item.label}</Link>
            </NavigationMenuLink>
        </NavigationMenuItem>
    );

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navbarHeight = isScrolled ? 'h-14' : 'h-16 sm:h-18 lg:h-20';

    return (
        <>
            <header
                className={cn(
                    'fixed top-0 w-full z-50 transition-all duration-500 ease-in-out',
                    isScrolled
                        ? 'bg-background/20 backdrop-blur-3xl border-b border-border/10 shadow-2xl'
                        : 'bg-transparent',
                )}
            >
                <div className="mx-auto max-w-7xl px-6">
                    <div
                        className={cn(
                            'flex items-center transition-all duration-300 ease-in-out',
                            navbarHeight,
                        )}
                    >
                        <div className="flex items-center space-x-2">
                            <Link
                                href="/"
                                className="flex items-center space-x-2"
                            >
                                <Logo />
                            </Link>
                        </div>

                        <div className="flex-1 flex justify-center mx-auto">
                            <NavigationMenu viewport={false}>
                                <NavigationMenuList>
                                    {baseLinks.map(renderLink)}
                                    {currentAccount?.role === 'staff' && (
                                        <NavigationMenuItem>
                                            <NavigationMenuTrigger>
                                                Management
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent>
                                                <ul className="grid w-[300px] gap-4 p-2">
                                                    <li>
                                                        <NavigationMenuLink
                                                            asChild
                                                            className="mb-2"
                                                        >
                                                            <Link
                                                                href="/question"
                                                                className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-xl transition"
                                                            >
                                                                <div className="p-1.5 bg-green-50 rounded-lg">
                                                                    <BadgeQuestionMark className="h-4 w-4 text-green-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-slate-900">
                                                                        Questions
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">
                                                                        Manage
                                                                        the
                                                                        question
                                                                        for
                                                                        blood
                                                                        request
                                                                        survey
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        </NavigationMenuLink>

                                                        <NavigationMenuLink
                                                            asChild
                                                            className="mb-2"
                                                        >
                                                            <Link
                                                                href="/blood-storage"
                                                                className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-xl transition"
                                                            >
                                                                <div className="p-1.5 bg-red-50 rounded-lg">
                                                                    <Droplet className="h-4 w-4 text-red-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-slate-900">
                                                                        Blood
                                                                        Storage
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">
                                                                        Manage
                                                                        all
                                                                        blood
                                                                        bags in
                                                                        storage
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        </NavigationMenuLink>

                                                        <NavigationMenuLink
                                                            asChild
                                                        >
                                                            <Link
                                                                href="/appointment"
                                                                className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-xl transition"
                                                            >
                                                                <div className="p-1.5 bg-blue-50 rounded-lg">
                                                                    <Calendar className="h-4 w-4 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-slate-900">
                                                                        Appointment
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">
                                                                        Manage
                                                                        all
                                                                        blood
                                                                        request
                                                                        appointments
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                </ul>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    )}
                                    {currentAccount?.role === 'admin' && (
                                        <>
                                            <NavigationMenuItem>
                                                <NavigationMenuLink
                                                    asChild
                                                    className={navigationMenuTriggerStyle()}
                                                >
                                                    <Link href="/dashboard">
                                                        Dashboard
                                                    </Link>
                                                </NavigationMenuLink>
                                            </NavigationMenuItem>
                                            <NavigationMenuItem>
                                                <NavigationMenuTrigger>
                                                    Management
                                                </NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                    <ul className="grid w-[300px] gap-4 p-2">
                                                        <li>
                                                            <NavigationMenuLink
                                                                asChild
                                                                className="mb-2"
                                                            >
                                                                <Link
                                                                    href="/blog-management"
                                                                    className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-xl transition"
                                                                >
                                                                    <div className="p-1.5 bg-purple-50 rounded-lg">
                                                                        <LayoutDashboard className="h-4 w-4 text-purple-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-slate-900">
                                                                            Blog
                                                                            Management
                                                                        </p>
                                                                        <p className="text-xs text-slate-500">
                                                                            Manage
                                                                            blog
                                                                            articles
                                                                        </p>
                                                                    </div>
                                                                </Link>
                                                            </NavigationMenuLink>
                                                            <NavigationMenuLink
                                                                asChild
                                                            >
                                                                <Link
                                                                    href="/account-management"
                                                                    className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-xl transition"
                                                                >
                                                                    <div className="p-1.5 bg-yellow-50 rounded-lg">
                                                                        <UserCog className="h-4 w-4 text-yellow-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-slate-900">
                                                                            Account
                                                                            Management
                                                                        </p>
                                                                        <p className="text-xs text-slate-500">
                                                                            Manage
                                                                            all
                                                                            user
                                                                            accounts
                                                                        </p>
                                                                    </div>
                                                                </Link>
                                                            </NavigationMenuLink>
                                                        </li>
                                                    </ul>
                                                </NavigationMenuContent>
                                            </NavigationMenuItem>
                                        </>
                                    )}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        <div className="hidden md:block">
                            {!currentAccount ? (
                                <div className="gap-4 flex">
                                    <Link href="/auth/register">
                                        <Button variant="outline">
                                            Register
                                        </Button>
                                    </Link>
                                    <Link href="/auth/login">
                                        <Button>Login</Button>
                                    </Link>
                                </div>
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200 group">
                                            <div className="size-8">
                                                <AccountPicture
                                                    name={currentAccount?.name}
                                                />
                                            </div>
                                            <ChevronDown className="h-3 w-3 text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-2xl p-2"
                                    >
                                        <div className="px-3 py-3 border-b border-slate-100 mb-2">
                                            <AccountOverview
                                                account={currentAccount}
                                            />
                                        </div>

                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                                            >
                                                <div className="p-1.5 bg-blue-50 rounded-lg">
                                                    <User className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-900">
                                                        Profile
                                                    </span>
                                                    <div className="text-xs text-slate-500">
                                                        Manage your account
                                                    </div>
                                                </div>
                                            </Link>
                                        </DropdownMenuItem>

                                        {currentAccount.role === 'donor' && (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href="/donation"
                                                        className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                                                    >
                                                        <div className="p-1.5 bg-rose-50 rounded-lg">
                                                            <Droplets className="h-4 w-4 text-rose-600" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-slate-900">
                                                                Donations
                                                            </span>
                                                            <div className="text-xs text-slate-500">
                                                                View donation
                                                                history
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href="/health"
                                                        className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                                                    >
                                                        <div className="p-1.5 bg-emerald-50 rounded-lg">
                                                            <Shield className="h-4 w-4 text-emerald-600" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-slate-900">
                                                                Health
                                                            </span>
                                                            <div className="text-xs text-slate-500">
                                                                Health records &
                                                                status
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href="/appointment"
                                                        className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                                                    >
                                                        <div className="p-1.5 bg-purple-50 rounded-lg">
                                                            <Calendar className="h-4 w-4 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-slate-900">
                                                                Appointments
                                                            </span>
                                                            <div className="text-xs text-slate-500">
                                                                Manage
                                                                appointments
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </DropdownMenuItem>
                                            </>
                                        )}

                                        <DropdownMenuSeparator className="my-2 bg-slate-100" />

                                        <DropdownMenuItem
                                            onClick={() => logout.mutate()}
                                            className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 focus:text-red-600 transition-colors duration-200"
                                        >
                                            <div className="p-1.5 bg-red-50 rounded-lg">
                                                <LogOut className="h-4 w-4 text-red-600" />
                                            </div>
                                            <div>
                                                <span className="font-medium">
                                                    Logout
                                                </span>
                                                <div className="text-xs text-red-500">
                                                    Sign out of your account
                                                </div>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {/* Enhanced Mobile Menu */}
                        <Sheet
                            open={isMobileMenuOpen}
                            onOpenChange={setIsMobileMenuOpen}
                        >
                            <SheetTrigger asChild className="md:hidden">
                                <Button
                                    variant="ghost"
                                    size={isScrolled ? 'sm' : 'icon'}
                                    className="transition-all duration-300 hover:bg-accent/80"
                                >
                                    <Menu
                                        className={cn(
                                            'transition-all duration-300',
                                            isScrolled ? 'h-4 w-4' : 'h-5 w-5',
                                        )}
                                    />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="w-[350px] sm:w-[400px] p-0"
                            >
                                <div className="flex flex-col h-full">
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-background to-accent/10">
                                        <div className="flex items-center space-x-3">
                                            <Logo />
                                        </div>
                                    </div>

                                    {/* Navigation Content */}
                                    <div className="flex-1 overflow-y-auto">
                                        <nav className="p-6 space-y-6">
                                            {/* Getting Started Section */}
                                            <div className="space-y-3">
                                                <details className="group">
                                                    <summary className="flex items-center justify-between cursor-pointer py-4 px-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 transition-all duration-200 border border-transparent hover:border-border/50">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                                                <BookOpen className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <span className="font-semibold">
                                                                Getting started
                                                            </span>
                                                        </div>
                                                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 text-muted-foreground" />
                                                    </summary>
                                                    <div className="mt-3 space-y-2 pl-4">
                                                        {gettingStartedItems.map(
                                                            (item, index) => (
                                                                <Link
                                                                    key={
                                                                        item.title
                                                                    }
                                                                    href={
                                                                        item.href
                                                                    }
                                                                    className="flex items-center space-x-3 py-3 px-4 text-sm rounded-lg hover:bg-accent/60 transition-all duration-200 group animate-in fade-in slide-in-from-left-2"
                                                                    style={{
                                                                        animationDelay: `${index * 100}ms`,
                                                                    }}
                                                                    onClick={() =>
                                                                        setIsMobileMenuOpen(
                                                                            false,
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                                        <item.icon className="w-3 h-3 text-primary" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                                            {
                                                                                item.title
                                                                            }
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground line-clamp-1">
                                                                            {
                                                                                item.description
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            ),
                                                        )}
                                                    </div>
                                                </details>

                                                {/* Components Section */}
                                                <details className="group">
                                                    <summary className="flex items-center justify-between cursor-pointer py-4 px-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 transition-all duration-200 border border-transparent hover:border-border/50">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/40 to-accent/20 flex items-center justify-center">
                                                                <Layers className="w-4 h-4 text-accent-foreground" />
                                                            </div>
                                                            <span className="font-semibold">
                                                                Components
                                                            </span>
                                                        </div>
                                                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 text-muted-foreground" />
                                                    </summary>
                                                    <div className="mt-3 space-y-2 pl-4 max-h-64 overflow-y-auto">
                                                        {components.map(
                                                            (
                                                                component,
                                                                index,
                                                            ) => (
                                                                <Link
                                                                    key={
                                                                        component.title
                                                                    }
                                                                    href={
                                                                        component.href
                                                                    }
                                                                    className="flex items-center space-x-3 py-3 px-4 text-sm rounded-lg hover:bg-accent/60 transition-all duration-200 group animate-in fade-in slide-in-from-left-2"
                                                                    style={{
                                                                        animationDelay: `${index * 50}ms`,
                                                                    }}
                                                                    onClick={() =>
                                                                        setIsMobileMenuOpen(
                                                                            false,
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                                        <component.icon className="w-3 h-3 text-primary" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                                            {
                                                                                component.title
                                                                            }
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground line-clamp-1">
                                                                            {
                                                                                component.description
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            ),
                                                        )}
                                                    </div>
                                                </details>

                                                {/* Direct Links */}
                                                <Link
                                                    href="/docs"
                                                    className="flex items-center space-x-3 py-4 px-4 font-semibold rounded-xl hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 transition-all duration-200 border border-transparent hover:border-border/50"
                                                    onClick={() =>
                                                        setIsMobileMenuOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center">
                                                        <FileText className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <span>Documentation</span>
                                                </Link>

                                                <Link
                                                    href="/pricing"
                                                    className="flex items-center space-x-3 py-4 px-4 font-semibold rounded-xl hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 transition-all duration-200 border border-transparent hover:border-border/50"
                                                    onClick={() =>
                                                        setIsMobileMenuOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center">
                                                        <BarChart3 className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <span>Pricing</span>
                                                </Link>
                                            </div>
                                        </nav>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="p-6 border-t bg-gradient-to-r from-background to-accent/5">
                                        <div className="flex flex-col space-y-3">
                                            <Button
                                                variant="ghost"
                                                className="justify-start font-medium hover:bg-accent/60 transition-all duration-200"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                            >
                                                Sign In
                                            </Button>
                                            <Button
                                                className="justify-start bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                            >
                                                Get Started
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            {/* Spacer to prevent content overlap */}
            <div
                className={cn(
                    'transition-all duration-300 ease-in-out',
                    navbarHeight,
                )}
            />
        </>
    );
}

const ListItem = forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'> & {
        icon?: React.ComponentType<{ className?: string }>;
        delay?: number;
    }
>(({ className, title, children, icon: Icon, delay = 0, ...props }, ref) => {
    return (
        <div
            className="animate-in fade-in slide-in-from-left-2 duration-300"
            style={{ animationDelay: `${delay}ms` }}
        >
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        'group block select-none rounded-xl p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent/60 hover:shadow-md hover:scale-[1.02] focus:bg-accent focus:text-accent-foreground border border-transparent hover:border-border/50',
                        className,
                    )}
                    {...props}
                >
                    <div className="flex items-start space-x-3">
                        {Icon && (
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0 mt-0.5">
                                <Icon className="w-4 h-4 text-primary" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium leading-none mb-2 group-hover:text-primary transition-colors">
                                {title}
                            </div>
                            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                                {children}
                            </p>
                        </div>
                    </div>
                </a>
            </NavigationMenuLink>
        </div>
    );
});
ListItem.displayName = 'ListItem';
