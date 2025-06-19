'use client';

import { fetchWrapper, throwIfError } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

export const schema = z.object({
    email: z
        .string()
        .min(1, { message: 'Username must be at least 1 characters.' }),
    password: z.string().nonempty({
        message: 'Password must not be empty.',
    }),
});

export const useLoginForm = () => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof schema>) => {
            const response = await fetchWrapper('/auth/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            await throwIfError(response);
        },
        onError: (error) => toast.error(error.message),
        onSuccess: () => router.push('/'),
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
