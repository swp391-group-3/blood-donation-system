'use client';

import { fetchWrapper, throwIfError } from '@/lib/api';
import { Answer } from '@/lib/api/dto/answer';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useApplyRequest = (id: string) => {
    return useMutation({
        mutationFn: async (values: { answers: Answer[] }) => {
            const response = await fetchWrapper(
                `/blood-request/${id}/create-appointment`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                },
            );

            await throwIfError(response);
        },
        onError: (error) => toast.error(error.message),
        onSuccess: () => toast.info('Submit successfully'),
    });
};
