import { throwIfError } from './../lib/api/index';
import { fetchWrapper } from '@/lib/api';
import { showErrorToast } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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
        onError: (error) => showErrorToast(error.message),
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
