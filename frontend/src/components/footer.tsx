'use client';

import { Logo } from '@/components/logo';
import { useCurrentAccount } from '@/hooks/use-current-account';
import { Account } from '@/lib/api/dto/account';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

function getMainLinks(account: Account | undefined, isError: boolean) {
    if (isError || !account) {
        return [
            { href: '/auth/login', label: 'Become a donor' },
            { href: '/request', label: 'Request' },
            { href: '/blog', label: 'Blog' },
        ];
    }
    if (account.role === 'donor') {
        return [
            { href: '/request', label: 'Request' },
            { href: '/blog', label: 'Blog' },
            { href: '/appointment', label: 'Appointment' },
            { href: '/profile', label: 'Account' },
        ];
    }
    if (account.role === 'staff') {
        return [
            { href: '/request', label: 'Request' },
            { href: '/blog', label: 'Blog' },
            { href: '/appointment/management', label: 'Appointment' },
            { href: '/blood-storage', label: 'Storage' },
        ];
    }
    if (account.role === 'admin') {
        return [
            { href: '/admin/account', label: 'Account' },
            { href: '/admin/blog', label: 'Blog' },
            { href: '/admin/appointment', label: 'Appointment' },
        ];
    }
    return [
        { href: '/request', label: 'Request' },
        { href: '/blog', label: 'Blog' },
        { href: '/', label: 'Privacy Policy' },
        { href: '/', label: 'Terms of service' },
    ];
}

export default function Footer() {
    const { data: account, isError } = useCurrentAccount();
    const mainLinks = getMainLinks(account, isError);

    return (
        <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
            <div className="container mx-auto px-4 max-w-6xl pt-10 pb-16">
                <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
                    <div className="w-full lg:w-1/3">
                        <Logo />
                        <p className="text-gray-600 leading-relaxed mt-4 text-sm">
                            Connecting donors with those in need. Every donation
                            saves lives and strengthens our community together.
                        </p>
                    </div>

                    <div className="w-full lg:w-1/3 px-1 sm:px-0">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Quick Links
                        </h4>
                        <div className="space-y-3">
                            {mainLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-all duration-200 group text-sm"
                                >
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                                        {link.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="w-full lg:w-1/3">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Get in Touch
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-red-200 transition">
                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Email Support
                                    </p>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        help@lifelink.org
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-200 pt-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-500">
                        <div>© 2025 LifeLink. All rights reserved.</div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                            <Link
                                href="/"
                                className="hover:text-red-600 transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/"
                                className="hover:text-red-600 transition-colors"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
