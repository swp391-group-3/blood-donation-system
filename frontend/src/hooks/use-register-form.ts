'use client';

import { fetchWrapper, throwIfError } from '@/lib/api';
import { genders } from '@/lib/api/dto/account';
import { bloodGroups } from '@/lib/api/dto/blood-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

export const schema = z.object({
    email: z.string().email(),
    password: z.string().nonempty({
        message: 'Password must not be empty.',
    }),
    name: z.string().min(1, { message: 'Name must be provided.' }),
    phone: z
        .string()
        .regex(/0[\d]{9,9}/, { message: 'Phone must consist of 10 number' }),
    address: z.string().min(1, { message: 'Address must be provided.' }),
    birthday: z.string(),
    blood_group: z.enum(bloodGroups),
    gender: z.enum(genders),
});

export const useRegisterForm = () => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof schema>) => {
            const response = await fetchWrapper('/auth/register', {
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
