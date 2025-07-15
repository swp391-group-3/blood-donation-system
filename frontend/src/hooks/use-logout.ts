import { fetchWrapper, throwIfError } from '@/lib/api';
import { showErrorToast } from '@/lib/utils';
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
        onError: (error) => showErrorToast(error.message),
        onSuccess: async () => {
            toast.message('Logout successfully');
            router.push('/');
            await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        },
    });
};
