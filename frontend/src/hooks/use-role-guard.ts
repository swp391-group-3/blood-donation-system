'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { Account, Role } from '@/lib/api/dto/account';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useRoleGuard = async (requiredRoles: Role[]) => {
    const router = useRouter();

    const response = await fetchWrapper('/auth/me');
    const account = await deserialize<Account>(response);

    if (requiredRoles.indexOf(account.role) !== -1) {
        return;
    }

    toast.error('Missing required role');

    router.push('/auth/login');
};
