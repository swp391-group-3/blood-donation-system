import { fetchWrapper } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await fetchWrapper(`/question/${id}`, {
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['question'],
            });
            toast.success('Delete Questions successfully');
        },
        onError: () => {
            toast.error('Fail to delete question');
        },
    });
};
