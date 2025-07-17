'use client';

import { fetchWrapper, throwIfError } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useRejectAppointment = (id: string) => {
    const router = useRouter();
    return useMutation({
        mutationFn: async (reason: string) => {
            const response = await fetchWrapper(`/appointment/${id}/reject`, {
                method: 'PATCH',
                body: JSON.stringify({ reason }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            await throwIfError(response);
        },
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            toast.success('Reject Donation Successfully');
            router.push('/appointment/management');
        },
    });
};
