import { fetchWrapper } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await fetchWrapper(`/blog/${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json',
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog'] });
            toast.success('Delete Blog Successfully');
        },
        onError: () => {
            toast.error('Failed to delete blog');
        },
    });
};
