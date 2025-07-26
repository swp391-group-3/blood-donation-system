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
    FileText,
    User,
    Droplets,
    Shield,
    Calendar,
    BadgeQuestionMark,
    Droplet,
    UserCog,
    LogOut,
    Settings,
    Home,
    LayoutDashboard,
    Newspaper,
    Users,
    Warehouse,
    HelpCircle,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from './logo';
import { useCurrentAccount } from '@/hooks/use-current-account';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { AccountPicture } from './account-picture';
import { AccountOverview } from './account-overview';
import { useLogout } from '@/hooks/use-logout';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: currentAccount } = useCurrentAccount();
    const logout = useLogout();

    const isGuestOrDonor =
        !currentAccount?.role || currentAccount?.role === 'donor';
    const isStaff = currentAccount?.role === 'staff';
    const isAdmin = currentAccount?.role === 'admin';

    const commonLinks = [
        { label: 'Home', href: '/' },
        { label: 'Blood Request', href: '/request' },
        { label: 'Blog', href: '/blog' },
    ];

    const mainMenuItems = isAdmin
        ? [
              { label: 'Home', href: '/', icon: Home },
              { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
          ]
        : [
              { label: 'Home', href: '/', icon: Home },
              { label: 'Blood Request', href: '/request', icon: Droplet },
              { label: 'Blog', href: '/blog', icon: Newspaper },
          ];

    const managementItems = isAdmin
        ? [
              {
                  label: 'Blog Management',
                  href: '/admin/blog',
                  icon: FileText,
              },
              {
                  label: 'Account Management',
                  href: '/admin/account',
                  icon: Users,
              },
          ]
        : isStaff
          ? [
                { label: 'Questions', href: '/question', icon: HelpCircle },
                {
                    label: 'Blood Storage',
                    href: '/blood-storage',
                    icon: Warehouse,
                },
                {
                    label: 'Appointment',
                    href: '/appointment/management',
                    icon: Calendar,
                },
            ]
          : [];

    const renderLink = (item: { label: string; href: string }) => (
        <NavigationMenuItem key={item.label}>
            <NavigationMenuLink
                asChild
                className={cn(
                    navigationMenuTriggerStyle(),
                    // Thêm conditional styling dựa trên isScrolled với glassmorphism effect
                    isScrolled
                        ? 'bg-white/60 hover:bg-white/80 hover:shadow-md border border-white/20 backdrop-blur-sm transition-all duration-300'
                        : 'hover:bg-accent hover:text-accent-foreground',
                )}
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
                        ? 'bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 shadow-lg shadow-slate-900/5'
                        : 'bg-transparent',
                )}
            >
                <div className="mx-auto max-w-7xl px-6">
                    <div
                        className={cn(
                            'w-full flex items-center justify-between px-4 md:px-8 transition-all duration-300 ease-in-out',
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

                        <div className="absolute left-1/2 transform -translate-x-1/2  hidden md:flex flex-1 justify-center">
                            <NavigationMenu viewport={false}>
                                <NavigationMenuList>
                                    {(isGuestOrDonor || isStaff) &&
                                        commonLinks.map(renderLink)}

                                    {isAdmin && (
                                        <>
                                            {renderLink({
                                                label: 'Home',
                                                href: '/',
                                            })}
                                            {renderLink({
                                                label: 'Dashboard',
                                                href: '/dashboard',
                                            })}
                                        </>
                                    )}

                                    {isStaff && (
                                        <NavigationMenuItem>
                                            <NavigationMenuTrigger
                                                className={cn(
                                                    isScrolled
                                                        ? 'bg-white/60 hover:bg-white/80 hover:shadow-md data-[state=open]:bg-white/80 border border-white/20 backdrop-blur-sm transition-all duration-300'
                                                        : 'hover:bg-accent data-[state=open]:bg-accent',
                                                )}
                                            >
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
                                                                className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                                                            >
                                                                <div className="flex gap-4">
                                                                    <div className="p-1.5 bg-green-50 h-8 w-8 rounded-lg">
                                                                        <BadgeQuestionMark className="h-4 w-4 text-green-600" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium text-slate-900 group-hover:text-slate-700">
                                                                            Questions
                                                                        </span>
                                                                        <div className="text-xs text-slate-500 group-hover:text-slate-600 line-clamp-2">
                                                                            Manage
                                                                            questions
                                                                            for
                                                                            blood
                                                                            request
                                                                            survey
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </NavigationMenuLink>

                                                        <NavigationMenuLink
                                                            asChild
                                                            className="mb-2"
                                                        >
                                                            <Link
                                                                href="/blood-storage"
                                                                className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                                                            >
                                                                <div className="flex gap-4">
                                                                    <div className="p-1.5 bg-red-50 h-8 w-8 rounded-lg">
                                                                        <Droplet className="h-4 w-4 text-red-600" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium text-slate-900 group-hover:text-slate-700">
                                                                            Blood
                                                                            Storage
                                                                        </span>
                                                                        <div className="text-xs text-slate-500 group-hover:text-slate-600 line-clamp-2">
                                                                            Manage
                                                                            all
                                                                            blood
                                                                            bags
                                                                            in
                                                                            the
                                                                            storage
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </NavigationMenuLink>

                                                        <NavigationMenuLink
                                                            asChild
                                                        >
                                                            <Link
                                                                href="/appointment"
                                                                className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                                                            >
                                                                <div className="flex gap-4">
                                                                    <div className="p-1.5 bg-blue-50 h-8 w-8 rounded-lg">
                                                                        <Calendar className="h-4 w-4 text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium text-slate-900 group-hover:text-slate-700">
                                                                            Appointment
                                                                        </span>
                                                                        <p className="text-xs text-slate-500 group-hover:text-slate-600 line-clamp-2">
                                                                            Manage
                                                                            all
                                                                            blood
                                                                            request
                                                                            appointments
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                </ul>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    )}

                                    {isAdmin && (
                                        <NavigationMenuItem>
                                            <NavigationMenuTrigger
                                                className={cn(
                                                    isScrolled
                                                        ? 'bg-white/60 hover:bg-white/80 hover:shadow-md data-[state=open]:bg-white/80 border border-white/20 backdrop-blur-sm transition-all duration-300'
                                                        : 'hover:bg-accent data-[state=open]:bg-accent',
                                                )}
                                            >
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
                                                                href="/admin/blog"
                                                                className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                                                            >
                                                                <div className="flex gap-4">
                                                                    <div className="p-1.5 bg-purple-50 h-8 w-8 rounded-lg">
                                                                        <FileText className="h-4 w-4 text-purple-600" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium text-slate-900 group-hover:text-slate-700">
                                                                            Manage
                                                                            Blogs
                                                                        </span>
                                                                        <p className="text-xs text-slate-500 group-hover:text-slate-600 line-clamp-2">
                                                                            Manage
                                                                            Blog
                                                                            and
                                                                            Articles
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </NavigationMenuLink>

                                                        <NavigationMenuLink
                                                            asChild
                                                        >
                                                            <Link
                                                                href="/admin/account"
                                                                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all duration-200 group"
                                                            >
                                                                <div className="flex gap-4">
                                                                    <div className="p-1.5 bg-yellow-50 h-8 w-8 rounded-lg">
                                                                        <UserCog className="h-4 w-4 text-yellow-600" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-slate-900 group-hover:text-slate-700">
                                                                            Account
                                                                            Management
                                                                        </p>
                                                                        <p className="text-xs text-slate-500 group-hover:text-slate-600 line-clamp-2">
                                                                            Manage
                                                                            all
                                                                            user
                                                                            accounts
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                </ul>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    )}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="hidden md:block">
                                {!currentAccount ? (
                                    <div className="gap-4 flex">
                                        <Link href="/auth/register">
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'transition-all duration-300',
                                                    isScrolled
                                                        ? 'bg-white/70 hover:bg-white/90 border-white/30 backdrop-blur-sm hover:shadow-md'
                                                        : '',
                                                )}
                                            >
                                                Register
                                            </Button>
                                        </Link>
                                        <Link href="/auth/login">
                                            <Button
                                                className={cn(
                                                    'transition-all duration-300',
                                                    isScrolled
                                                        ? 'shadow-lg hover:shadow-xl bg-primary hover:bg-primary/90'
                                                        : '',
                                                )}
                                            >
                                                Login
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200 group">
                                                <div className="size-8">
                                                    <AccountPicture
                                                        name={
                                                            currentAccount?.name
                                                        }
                                                    />
                                                </div>
                                                <ChevronDown className="h-3 w-3 text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className={cn(
                                                'mt-2 border shadow-xl rounded-2xl p-2 transition-all duration-300',
                                                isScrolled
                                                    ? 'bg-white/90 backdrop-blur-xl border-white/20 shadow-2xl shadow-slate-900/10'
                                                    : 'bg-white/95 backdrop-blur-xl border-slate-200/60',
                                            )}
                                        >
                                            <div className="px-3 py-3 border-b border-slate-100 mb-2">
                                                <AccountOverview
                                                    account={currentAccount}
                                                />
                                            </div>

                                            {currentAccount.role ===
                                                'donor' && (
                                                <>
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
                                                                    Manage your
                                                                    account
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </DropdownMenuItem>

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
                                                                    View
                                                                    donation
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
                                                                    Health
                                                                    records &
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
                        </div>

                        <Sheet
                            open={isMobileMenuOpen}
                            onOpenChange={setIsMobileMenuOpen}
                        >
                            <SheetTrigger asChild className="md:hidden">
                                <Button
                                    variant="ghost"
                                    size={isScrolled ? 'sm' : 'icon'}
                                    className={cn(
                                        'transition-all duration-300',
                                        isScrolled
                                            ? 'hover:bg-white/80 hover:shadow-md bg-white/60 border border-white/20 backdrop-blur-sm'
                                            : 'hover:bg-accent/80',
                                    )}
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
                                    <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-background to-accent/10">
                                        <div className="flex items-center space-x-3">
                                            <Logo />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        <nav className="p-6 space-y-6">
                                            <div className="space-y-3">
                                                {mainMenuItems.map((item) => (
                                                    <Link
                                                        key={item.label}
                                                        href={item.href}
                                                        onClick={() =>
                                                            setIsMobileMenuOpen(
                                                                false,
                                                            )
                                                        }
                                                        className="flex items-center space-x-3 py-4 px-4 font-semibold rounded-xl hover:bg-accent/60 transition-all duration-200 border border-transparent hover:border-border/50"
                                                    >
                                                        <div
                                                            className={cn(
                                                                'w-8 h-8 rounded-lg flex items-center justify-center',
                                                                {
                                                                    Home: 'bg-blue-50 text-blue-600',
                                                                    'Blood Request':
                                                                        'bg-rose-50 text-rose-600',
                                                                    Blog: 'bg-yellow-50 text-yellow-600',
                                                                    Dashboard:
                                                                        'bg-indigo-50 text-indigo-600',
                                                                }[item.label] ||
                                                                    'bg-muted/20 text-muted-foreground',
                                                            )}
                                                        >
                                                            <item.icon className="w-4 h-4" />
                                                        </div>
                                                        <span>
                                                            {item.label}
                                                        </span>
                                                    </Link>
                                                ))}

                                                {managementItems.length > 0 && (
                                                    <details className="group">
                                                        <summary className="flex items-center justify-between cursor-pointer py-4 px-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 transition-all duration-200 border border-transparent hover:border-border/50">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                                                    <Settings className="w-4 h-4 text-purple-600" />
                                                                </div>
                                                                <span className="font-semibold">
                                                                    Management
                                                                </span>
                                                            </div>
                                                            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 text-muted-foreground" />
                                                        </summary>
                                                        <div className="mt-3 space-y-2 pl-4">
                                                            {managementItems.map(
                                                                (item, idx) => (
                                                                    <Link
                                                                        key={
                                                                            item.label
                                                                        }
                                                                        href={
                                                                            item.href
                                                                        }
                                                                        onClick={() =>
                                                                            setIsMobileMenuOpen(
                                                                                false,
                                                                            )
                                                                        }
                                                                        className="flex items-center space-x-3 py-3 px-4 text-sm rounded-lg hover:bg-accent/60 transition-all duration-200 group animate-in fade-in slide-in-from-left-2"
                                                                        style={{
                                                                            animationDelay: `${idx * 100}ms`,
                                                                        }}
                                                                    >
                                                                        <div
                                                                            className={cn(
                                                                                'w-6 h-6 rounded-md flex items-center justify-center group-hover:bg-opacity-20 transition-colors',
                                                                                {
                                                                                    Questions:
                                                                                        'bg-amber-50 text-amber-600',
                                                                                    'Blood Storage':
                                                                                        'bg-emerald-50 text-emerald-600',
                                                                                    Appointment:
                                                                                        'bg-purple-50 text-purple-600',
                                                                                    'Blog Management':
                                                                                        'bg-cyan-50 text-cyan-600',
                                                                                    'Account Management':
                                                                                        'bg-pink-50 text-pink-600',
                                                                                }[
                                                                                    item
                                                                                        .label
                                                                                ] ||
                                                                                    'bg-muted/20 text-muted-foreground',
                                                                            )}
                                                                        >
                                                                            <item.icon className="w-3 h-3" />
                                                                        </div>
                                                                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                                            {
                                                                                item.label
                                                                            }
                                                                        </span>
                                                                    </Link>
                                                                ),
                                                            )}
                                                        </div>
                                                    </details>
                                                )}
                                            </div>
                                        </nav>
                                    </div>

                                    <div className="p-6 border-t bg-gradient-to-r from-background to-accent/5">
                                        {currentAccount ? (
                                            <div className="space-y-1">
                                                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                                    Account
                                                </div>

                                                {currentAccount?.role ===
                                                    'donor' && (
                                                    <>
                                                        <Link
                                                            href="/profile"
                                                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent/30 rounded-xl transition-colors duration-200"
                                                            onClick={() =>
                                                                setIsMobileMenuOpen(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            <div className="p-1.5 bg-blue-50 rounded-lg">
                                                                <User className="h-4 w-4 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">
                                                                    Profile
                                                                </span>
                                                                <div className="text-xs text-muted-foreground">
                                                                    Manage your
                                                                    account
                                                                </div>
                                                            </div>
                                                        </Link>

                                                        <Link
                                                            href="/donation"
                                                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent/30 rounded-xl transition-colors duration-200"
                                                            onClick={() =>
                                                                setIsMobileMenuOpen(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            <div className="p-1.5 bg-rose-50 rounded-lg">
                                                                <Droplets className="h-4 w-4 text-rose-600" />
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">
                                                                    Donations
                                                                </span>
                                                                <div className="text-xs text-muted-foreground">
                                                                    View
                                                                    donation
                                                                    history
                                                                </div>
                                                            </div>
                                                        </Link>

                                                        <Link
                                                            href="/health"
                                                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent/30 rounded-xl transition-colors duration-200"
                                                            onClick={() =>
                                                                setIsMobileMenuOpen(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            <div className="p-1.5 bg-emerald-50 rounded-lg">
                                                                <Shield className="h-4 w-4 text-emerald-600" />
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">
                                                                    Health
                                                                </span>
                                                                <div className="text-xs text-muted-foreground">
                                                                    Health
                                                                    records &
                                                                    status
                                                                </div>
                                                            </div>
                                                        </Link>

                                                        <Link
                                                            href="/appointment"
                                                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent/30 rounded-xl transition-colors duration-200"
                                                            onClick={() =>
                                                                setIsMobileMenuOpen(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            <div className="p-1.5 bg-purple-50 rounded-lg">
                                                                <Calendar className="h-4 w-4 text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">
                                                                    Appointments
                                                                </span>
                                                                <div className="text-xs text-muted-foreground">
                                                                    Manage
                                                                    appointments
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </>
                                                )}

                                                <button
                                                    onClick={() =>
                                                        logout.mutate()
                                                    }
                                                    className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 w-full"
                                                >
                                                    <div className="p-1.5 bg-red-50 rounded-lg">
                                                        <LogOut className="h-4 w-4 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-left font-medium">
                                                            Logout
                                                        </p>
                                                        <div className="text-xs text-red-500">
                                                            Sign out of your
                                                            account
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="p-6 bg-gradient-to-r from-background to-accent/5">
                                                <div className="flex flex-col space-y-3">
                                                    <Link href="/auth/register">
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-start font-medium hover:bg-accent/60 transition-all duration-200"
                                                            onClick={() =>
                                                                setIsMobileMenuOpen(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            Register
                                                        </Button>
                                                    </Link>
                                                    <Link href="/auth/login">
                                                        <Button
                                                            className="w-full justify-start bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                                            onClick={() =>
                                                                setIsMobileMenuOpen(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            Login
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

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
