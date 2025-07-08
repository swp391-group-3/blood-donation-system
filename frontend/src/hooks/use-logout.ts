import { fetchWrapper, throwIfError } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useLogout = () => {
    const mutation = useMutation({
        mutationFn: async () => {
            const response = await fetchWrapper('/auth/logout');
            await throwIfError(response);
        },
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            toast.message('Logout successfully');
        },
    });
    return { mutation };
};
