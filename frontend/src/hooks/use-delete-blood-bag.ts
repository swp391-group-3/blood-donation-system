import { fetchWrapper } from '@/lib/api';
import { showErrorToast } from '@/lib/utils';
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
            showErrorToast('Failed To Delete Blood Bag');
        },
    });
};
