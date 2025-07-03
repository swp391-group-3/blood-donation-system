'use client';

import { fetchWrapper, throwIfError } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const usePostChat = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (message: string) => {
            const response = await fetchWrapper('/chat', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });
            await throwIfError(response);
        },
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            toast.success('Sent message successfully');
            queryClient.invalidateQueries({
                queryKey: ['chat'],
            });
        },
    });

    return {
        mutation,
    };
};
