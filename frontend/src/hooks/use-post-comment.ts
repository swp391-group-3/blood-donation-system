import { zodResolver } from '@hookform/resolvers/zod';
import { throwIfError } from './../lib/api/index';
import { fetchWrapper } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const usePostComment = (id: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (values: string) => {
            const response = await fetchWrapper(`/blog/${id}/comment`, {
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
        onSuccess: () => {
            toast.success('Post comment successfully');
            queryClient.invalidateQueries({
                queryKey: ['blog', id, 'comment'],
            });
        },
    });

    return {
        mutation,
    };
};
