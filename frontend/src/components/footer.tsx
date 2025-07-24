'use client';
import { Logo } from '@/components/logo';
import { useCurrentAccount } from '@/hooks/use-current-account';
import { Account } from '@/lib/api/dto/account';
import { Heart, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function getMainLinks(account: Account | undefined, isError: boolean) {
    if (isError || !account) {
        return [
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
    ];
}
export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Brand Section */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Heart className="w-7 h-7 text-white fill-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        LifeLink
                                    </h3>
                                    <p className="text-gray-500 font-medium">
                                        Blood Donation Network
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Connecting donors with those in need. Every
                                donation saves lives and strengthens our
                                community together.
                            </p>
                            <div className="flex items-center gap-2 text-red-600 font-medium">
                                <Heart className="w-4 h-4 fill-current" />
                                <span className="text-sm">
                                    Join 10,000+ Life Savers
                                </span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="lg:col-span-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-6">
                                Quick Links
                            </h4>
                            <div className="space-y-4">
                                {[
                                    { name: 'Home', href: '#' },
                                    { name: 'Blood Request', href: '#' },
                                    { name: 'Become a Donor', href: '#' },
                                    { name: 'Blog & Resources', href: '#' },
                                    { name: 'About Us', href: '#' },
                                ].map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-all duration-200 group"
                                    >
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                                            {link.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="lg:col-span-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-6">
                                Get in Touch
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-red-200 transition-colors duration-200">
                                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Emergency Hotline
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            1-800-DONATE
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-red-200 transition-colors duration-200">
                                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Email Support
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            help@lifelink.org
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-red-200 transition-colors duration-200">
                                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Visit Us
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            123 Health Center Dr
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Medical District, NY 10001
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-6">
                            <p className="text-gray-500 text-sm">
                                © {new Date().getFullYear()} LifeLink. All
                                rights reserved.
                            </p>
                            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                                <span>Made with</span>
                                <Heart className="w-3 h-3 text-red-500 fill-current" />
                                <span>for humanity</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link
                                href="#"
                                className="text-gray-500 hover:text-red-600 text-sm transition-colors duration-200"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-500 hover:text-red-600 text-sm transition-colors duration-200"
                            >
                                Terms of Service
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-500 hover:text-red-600 text-sm transition-colors duration-200"
                            >
                                Accessibility
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
