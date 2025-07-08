import { z } from 'zod';
import { schema as registerSchema } from './use-register-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWrapper, throwIfError } from '@/lib/api';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const schema = registerSchema.omit({
    email: true,
    password: true,
    blood_group: true,
});

export const useUpdateDataTable = (
    defaultValues?: z.infer<typeof schema>,
    opts?: { onSuccess?: () => void }
) => {
    const qc = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof schema>) => {
            console.log("values", values);

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
            qc.invalidateQueries({ queryKey: ["account"] })
            opts?.onSuccess?.();
        },
    });

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues ?? {},
    });

    return {
        mutation,
        form,
    };
};
