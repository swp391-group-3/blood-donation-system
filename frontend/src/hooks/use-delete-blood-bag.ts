import { fetchWrapper } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteBloodBag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await fetchWrapper(`/blood-bag/${id}`, {
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['blood-bag'],
            });
            toast.success('Blood bag deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete blood bag');
        },
    });
};
