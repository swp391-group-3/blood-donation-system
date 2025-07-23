'use client';

import { priorities } from './../lib/api/dto/blood-request';
import { z } from 'zod';
import { fetchWrapper, throwIfError } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const schema = z.object({
    title: z.string().min(1, 'Blood Title must be included').optional(),
    priority: z
        .enum(priorities, {
            errorMap: () => ({ message: 'Priority is invalid' }),
        })
        .optional(),
    max_people: z.number().min(1, 'At least one people').optional(),
});

export const useUpdateBloodRequestForm = (id: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof schema>) => {
            const response = await fetchWrapper(`/blood-request/${id}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            await throwIfError(response);
        },
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            toast.success('Update blood request successfully');
            queryClient.invalidateQueries({ queryKey: ['blood-request'] });
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
