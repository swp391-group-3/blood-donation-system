'use client';

import { fetchWrapper, throwIfError } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface RejectPayload {
    reason: string;
    isBanned: boolean;
}

export const useRejectAppointment = (id: string) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: RejectPayload) => {
            const response = await fetchWrapper(`/appointment/${id}/reject`, {
                method: 'PATCH',
                body: JSON.stringify({
                    reason: payload.reason,
                    is_banned: payload.isBanned,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            await throwIfError(response);
        },
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            toast.success('Reject Donation Successfully');
            queryClient.invalidateQueries({ queryKey: ['appointment'] });
            router.push('/appointment/management');
        },
    });
};
