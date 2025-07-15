'use client';

import { fetchWrapper, throwIfError } from '@/lib/api';
import { Answer } from '@/lib/api/dto/answer';
import { showErrorToast } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useApplyRequest = (id: string) => {
    const router = useRouter();

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
        onError: (error) => {
            showErrorToast(error);
        },
        onSuccess: () => {
            toast.info('Submit successfully');
            router.push('/appointment');
        },
    });
};
