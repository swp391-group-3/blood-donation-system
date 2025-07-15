'use client';

import { fetchWrapper, throwIfError } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

export const schema = z
    .object({
        heart_rate: z.number({ coerce: true }).int(),
        is_good_health: z.boolean(),
        lower_blood_pressure: z.number({ coerce: true }).int(),
        note: z.string().optional(),
        temperature: z.number({ coerce: true }),
        upper_blood_pressure: z.number({ coerce: true }).int(),
        weight: z.number({ coerce: true }).int(),
    })
    .refine((data) => data.lower_blood_pressure < data.upper_blood_pressure, {
        message: 'upper blood pressure must be > lower blood pressure',
        path: ['upper_blood_pressure', 'lower_blood_pressure'],
    });

export const useHealthForm = (appointmentId: string) => {
    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof schema>) => {
            const response = await fetchWrapper(
                `/appointment/${appointmentId}/health`,
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
        onSuccess: () => toast.info('Add health successfully'),
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
