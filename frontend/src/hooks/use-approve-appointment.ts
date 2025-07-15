'use client';

import { fetchWrapper, throwIfError } from '@/lib/api';
import { showErrorToast } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useApproveAppointment = (id: string) => {
    return useMutation({
        mutationFn: async () => {
            const response = await fetchWrapper(`/appointment/${id}/approve`, {
                method: 'PATCH',
            });

            await throwIfError(response);
        },
        onError: (error) => {
            showErrorToast(error);
        },
        onSuccess: () => toast.info('Success'),
    });
};
