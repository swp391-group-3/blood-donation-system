import { useCurrentAccount } from '@/hooks/use-current-account';
import { Role } from '@/lib/api/dto/account';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { toast } from 'sonner';

interface Props {
    roles: Role[];
}

export function WithRole({ children, roles }: PropsWithChildren<Props>) {
    const { data: account, isPending, error } = useCurrentAccount();

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
