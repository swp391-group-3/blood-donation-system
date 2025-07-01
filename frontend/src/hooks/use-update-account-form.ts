'use client';

import { fetchWrapper, throwIfError } from '@/lib/api';
import { schema as registerSchema } from './use-register-form';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const schema = registerSchema.omit({
    email: true,
    password: true,
    blood_group: true,
});

export const useUpdateAccountForm = (
    defaultValues?: z.infer<typeof schema>,
    opts?: { onSuccess?: () => void }
) => {
    const qc = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof schema>) => {
            const response = await fetchWrapper('/account', {
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
            toast.success('Profile updated successfully!');
            qc.invalidateQueries({ queryKey: ['auth', 'me'] });
            opts?.onSuccess?.();
        },
    });

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    return {
        mutation,
        form,
    };
};
