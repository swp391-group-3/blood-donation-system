'use client';

import { fetchWrapper, throwIfError } from '@/lib/api';
import { showErrorToast } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useRejectAppointment = (id: string) => {
    return useMutation({
        mutationFn: async () => {
            const response = await fetchWrapper(`/appointment/${id}/reject`, {
                method: 'PATCH',
            });

            await throwIfError(response);
        },
        onError: (error) => showErrorToast(error.message),
        onSuccess: () => toast.info('Success'),
    });
};
