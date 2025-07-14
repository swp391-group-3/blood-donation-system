'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { Account, Role } from '@/lib/api/dto/account';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useRoleGuard = async (requiredRoles: Set<Role>) => {
    const router = useRouter();

    const response = await fetchWrapper('/auth/me');
    const account = await deserialize<Account>(response);

    if (requiredRoles.has(account.role)) {
        return;
    }

    toast.error('Missing required role');

    router.push('/auth/login');
};
