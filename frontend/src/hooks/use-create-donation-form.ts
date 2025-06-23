import { fetchWrapper, throwIfError } from '@/lib/api';
import { donationTypes } from '@/lib/api/dto/donation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

export const schema = z.object({
    type: z.enum(donationTypes),
    password: z.coerce.number(),
});

export const useCreateDonationForm = (appointmentId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof schema>) => {
            const response = await fetchWrapper(
                `/appointment/${appointmentId}/donation`,
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
        onSuccess: () => {
            toast.info('Create Donation Successfully');
            queryClient.invalidateQueries({
                queryKey: ['appointment', appointmentId],
            });
        },
    });

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {},
    });

    return {
        mutation,
        form,
    };
};
