import { fetchWrapper } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BloodBag } from '@/lib/api/dto/blood-bag';

export const useDeleteBloodBag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await fetchWrapper(`/blood-bag/${id}`, {
                method: 'DELETE',
            });
        },
        onSuccess: (_, id) => {
            queryClient.setQueryData<BloodBag[]>(['blood-bag'], (prev) =>
                Array.isArray(prev)
                    ? prev.filter((bag) => bag.id !== id)
                    : prev,
            );
            toast.success('Blood bag deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete blood bag');
        },
    });
};
