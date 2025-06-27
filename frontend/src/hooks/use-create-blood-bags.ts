'use client';

import { fetchWrapper, throwIfError } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreateBloodBag } from '@/lib/api/dto/blood-bag';
import { useRouter } from 'next/navigation';

export const useCreateBloodBags = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async ({
            appointmentId,
            donationId,
            bloodBags,
        }: {
            appointmentId: string;
            donationId: string;
            bloodBags: CreateBloodBag[];
        }) => {
            Promise.all([
                ...bloodBags.map((bag) =>
                    (async () => {
                        const response = await fetchWrapper(
                            `/donation/${donationId}/blood-bag`,
                            {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(bag),
                            },
                        );

                        await throwIfError(response);
                    })(),
                ),
                (async () => {
                    const response = await fetchWrapper(
                        `/appointment/${appointmentId}/done`,
                        {
                            method: 'PATCH',
                        },
                    );

                    await throwIfError(response);
                })(),
            ]);
        },
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            toast.info('Successfully add blood bags');
            router.push('/appointment/management');
        },
    });
};
