'use client';

import { useState } from 'react';
import {
    Home,
    Droplets,
    FileText,
    User,
    ChevronDown,
    Calendar,
    Shield,
    LogOut,
    Menu,
    X,
    LucideIcon,
    Package,
    LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/logo';
import { AccountPicture } from '@/components/account-picture';
import { useCurrentAccount } from '@/hooks/use-current-account';
import Link from 'next/link';
import { AccountOverview } from '@/components/account-overview';
import { Role } from '@/lib/api/dto/account';
import { useLogout } from '@/hooks/use-logout';

interface NavigationItem {
    label: string;
    icon: LucideIcon;
    href: string;
}

const getNavigationItems = (role?: Role): NavigationItem[] => {
    switch (role) {
        case 'staff':
            return [
                {
                    label: 'Home',
                    icon: Home,
                    href: '/',
                },
                {
                    label: 'Blood Storage',
                    icon: Package,
                    href: '/blood-storage',
                },
                {
                    label: 'Blood Request',
                    icon: Droplets,
                    href: '/request',
                },
                {
                    label: 'Blog',
                    icon: FileText,
                    href: '/blog',
                },
            ];

        case 'admin':
            return [
                {
                    label: 'Home',
                    icon: Home,
                    href: '/',
                },
                {
                    label: 'Dashboard',
                    icon: LayoutDashboard,
                    href: '/admin',
                },
                {
                    label: 'Account Management',
                    icon: User,
                    href: '/admin/account',
                },
                {
                    label: 'Blog Management',
                    icon: FileText,
                    href: '/admin/blog',
                },
            ];

        default:
            return [
                {
                    label: 'Home',
                    icon: Home,
                    href: '/',
                },
                {
                    label: 'Blood Request',
                    icon: Droplets,
                    href: '/request',
                },
                {
                    label: 'Blog',
                    icon: FileText,
                    href: '/blog',
                },
            ];
    }
};

export const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: account } = useCurrentAccount();
    const items = getNavigationItems(account?.role);
    const logout = useLogout();

    return (
        <>
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-300/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Logo />
                        <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-12">
                            {items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-slate-700 hover:text-rose-600 font-medium text-sm transition-colors duration-200 relative group"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center space-x-3 flex-shrink-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="md:hidden hover:bg-slate-100 rounded-xl p-2.5 transition-all duration-200"
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-5 w-5 text-slate-600" />
                                ) : (
                                    <Menu className="h-5 w-5 text-slate-600" />
                                )}
                            </Button>

                            <div className="hidden md:block">
                                {!account ? (
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
                                                        name={account.name}
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
                                                    account={account}
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

                                            {account.role === 'donor' && (
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
                        </div>
                    </div>
                </div>
            </header>

            <div
                className={`fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {account && (
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-slate-50 to-slate-100/50">
                        <AccountOverview account={account} />
                    </div>
                )}

                <div className="px-6 py-4">
                    <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                            Navigation
                        </div>
                        {items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-4 px-4 py-3 text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 group"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <div className="p-2 bg-slate-100 group-hover:bg-rose-100 rounded-lg transition-colors duration-200">
                                    <item.icon className="h-5 w-5 group-hover:text-rose-600" />
                                </div>
                                <span className="font-medium">
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-200">
                    <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                            Account
                        </div>
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
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
                        {account?.role === 'donor' && (
                            <>
                                <Link
                                    href="/donation"
                                    className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="p-1.5 bg-rose-50 rounded-lg">
                                        <Droplets className="h-4 w-4 text-rose-600" />
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-900">
                                            Donations
                                        </span>
                                        <div className="text-xs text-slate-500">
                                            View donation history
                                        </div>
                                    </div>
                                </Link>
                                <Link
                                    href="/health"
                                    className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="p-1.5 bg-emerald-50 rounded-lg">
                                        <Shield className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-900">
                                            Health
                                        </span>
                                        <div className="text-xs text-slate-500">
                                            Health records & status
                                        </div>
                                    </div>
                                </Link>
                                <Link
                                    href="/appointment"
                                    className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="p-1.5 bg-purple-50 rounded-lg">
                                        <Calendar className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-900">
                                            Appointments
                                        </span>
                                        <div className="text-xs text-slate-500">
                                            Manage appointments
                                        </div>
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 mt-auto border-t border-slate-200">
                    <button
                        onClick={() => logout.mutate()}
                        className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="p-1.5 bg-red-50 rounded-lg">
                            <LogOut className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                            <p className="text-left font-medium">Logout</p>
                            <div className="text-xs text-red-500">
                                Sign out of your account
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
};
