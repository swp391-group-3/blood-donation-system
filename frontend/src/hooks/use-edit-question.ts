import { fetchWrapper, throwIfError } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useAddQuestion = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newContent: string) => {
            const response = await fetchWrapper(`/question/${id}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: newContent,
            });
            await throwIfError(response);
        },
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['question'],
            });
            toast.info('Edit question successfully');
        },
    });
};
