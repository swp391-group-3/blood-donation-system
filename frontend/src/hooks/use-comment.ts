import { useQuery } from '@tanstack/react-query';
import { fetchWrapper, deserialize } from '@/lib/api';
import { Comment } from '@/lib/api/dto/comment';

export const useComment = (blogId?: string) => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper(`/blog/${blogId}/comment`);
            return await deserialize<Comment[]>(response);
        },
        queryKey: ['blog', blogId, 'comment'],
        enabled: !!blogId,
    });
};
