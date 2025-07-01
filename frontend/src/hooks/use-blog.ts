import { deserialize, fetchWrapper } from '@/lib/api';
import { Blog } from '@/lib/api/dto/blog';
import { useQuery } from '@tanstack/react-query';

export const useBlog = (id?: string) => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper(`/blog/${id}`);
            return await deserialize<Blog>(response);
        },
        queryKey: ['blog', id],
    });
};
