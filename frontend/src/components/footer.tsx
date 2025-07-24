'use client';

import { Github } from 'lucide-react';
import { Footer } from '@/components/ui/footer';
import { Logo } from '@/components/logo';
import { useCurrentAccount } from '@/hooks/use-current-account';
import { Account } from '@/lib/api/dto/account';

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

function MainFooter() {
    const { data: account, isError } = useCurrentAccount();

    const mainLinks = getMainLinks(account, isError);

    return (
        <div className="w-full">
            <Footer
                logo={<Logo />}
                socialLinks={[
                    {
                        icon: <Github className="h-5 w-5" />,
                        href: 'https://github.com/swp391-group-3/blood-donation-system',
                        label: 'GitHub',
                    },
                ]}
                mainLinks={mainLinks}
                legalLinks={[
                    { href: '/', label: 'Privacy' },
                    { href: '/', label: 'Terms' },
                ]}
                copyright={{
                    text: '© 2025 LifeLink',
                    license: 'All rights reserved',
                }}
            />
        </div>
    );
}

export { MainFooter };
