'use client';

import { Role } from '@/lib/service/account';
import { getCurrentAccount, getCurrentAccountKey } from '@/lib/service/auth';
import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { toast } from 'sonner';

interface Props {
    roles: Role[];
}

export function WithRole({ children, roles }: PropsWithChildren<Props>) {
    const {
        data: account,
        isPending,
        error,
    } = useQuery({
        queryFn: getCurrentAccount,
        queryKey: getCurrentAccountKey,
    });

    if (isPending) {
        return <div></div>;
    }

    if (error || roles.indexOf(account.role) === -1) {
        toast.error('Missing required role');
        redirect('/auth/login');
    }

    return (
        <>
            <main>{children}</main>
        </>
    );
}
