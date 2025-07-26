import { fetchWrapper, throwIfError } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useLogout = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            const response = await fetchWrapper('/auth/logout', {
                method: 'POST',
            });
            await throwIfError(response);
        },
        onError: (error) => toast.error(error.message),
        onSuccess: async () => {
            queryClient.setQueryData(['auth', 'me'], null)
            toast.success('Logout successful')
            router.push('/')
        },
    });
};
