import { fetchWrapper, throwIfError } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const blogPostSchema = z.object({
    title: z.string().min(1, 'Must inclucde blog title'),
    description: z.string().min(1, 'Must include blog description'),
    tags: z.array(z.string()),
    content: z.string().min(1, 'Must include blog content'),
});

export const useCreateBlogFrom = () => {
    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof blogPostSchema>) => {
            const response = await fetchWrapper('/blog', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            await throwIfError(response);
        },
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            toast.info('Create Blog Successfully');
        },
    });
    const form = useForm<z.infer<typeof blogPostSchema>>({
        resolver: zodResolver(blogPostSchema),
        defaultValues: {},
    });
    return {
        mutation,
        form,
    };
};
