import { priorities } from './../lib/api/dto/blood-request';
import { z } from 'zod';
import { bloodGroups } from '@/lib/api/dto/blood-group';
import { fetchWrapper, throwIfError } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const bloodRequestSchema = z.object({
    title: z.string().min(1, 'Blood Title must be included'),
    priority: z.enum(priorities, {
        errorMap: () => ({ message: 'Priority is invalid' }),
    }),
    blood_groups: z
        .array(
            z.enum(bloodGroups, {
                errorMap: () => ({ message: 'Blood Group is invalid' }),
            }),
        )
        .min(1, 'At least one blood group'),
    max_people: z.number().min(1, 'At least one people'),
    start_time: z.date(),
    end_time: z.date(),
});

export const useBloodRequestForm = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof bloodRequestSchema>) => {
            const response = await fetchWrapper('/blood-request', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            await throwIfError(response);
        },
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success('Create blood request successfully');
            queryClient.invalidateQueries({ queryKey: ['blood-requests'] });
        },
    });

    const form = useForm<z.infer<typeof bloodRequestSchema>>({
        resolver: zodResolver(bloodRequestSchema),
        defaultValues: {},
    });

    return {
        mutation,
        form,
    };
};
