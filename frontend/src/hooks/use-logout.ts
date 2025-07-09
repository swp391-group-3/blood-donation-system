import { fetchWrapper, throwIfError } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useLogout = () => {
    const queryClient = useQueryClient();
    console.log('logout');
    const mutation = useMutation({
        mutationFn: async () => {
            const response = await fetchWrapper('/auth/logout');
            await throwIfError(response);
        },
        onError: (error) => toast.error(error.message),
        onSuccess: async () => {
            toast.message('Logout successfully');
            await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        },
    });
    return { mutation };
};
