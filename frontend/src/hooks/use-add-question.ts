import { fetchWrapper, throwIfError } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useAddQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (content: string) => {
            const response = await fetchWrapper('/question', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: content,
            });
            await throwIfError(response);
        },
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['question'],
            });
            toast.info('Add question successfully');
        },
    });
};
