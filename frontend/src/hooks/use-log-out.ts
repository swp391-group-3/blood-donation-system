'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchWrapper } from '@/lib/api';
import { toast } from 'sonner';

export const useLogout = () => {
    const qc = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            await fetchWrapper('/auth/logout', {
                method: 'POST',
            });
            
        },
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["auth", "me"]})
            qc.clear();
            router.push('/');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};
