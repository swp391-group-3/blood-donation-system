'use client';

import { useCurrentAccount } from '@/hooks/use-current-account';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const { data: account } = useCurrentAccount();
    if (account && account.is_banned) {
        toast.warning('You have been banned from donating blood');
        router.push('/');
    }

    return (
        <>
            <main>{children}</main>
        </>
    );
}
