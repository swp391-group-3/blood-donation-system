import { fetchWrapper } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await fetchWrapper(`/account/${id}`, {
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['account'] });
            toast.success('Delete Account Successfully');
        },
        onError: () => {
            toast.success('Failed To Delete Account');
        },
    });
};
