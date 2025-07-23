'use client';

import { buildParams, deserialize, fetchWrapper, Pagination } from '@/lib/api';
import { Blog } from '@/lib/api/dto/blog';
import { useQuery } from '@tanstack/react-query';

interface Filter {
    query?: string;
    page_size?: number;
    page_index?: number;
}

export const useBlogList = (filter: Filter) => {
    const params = buildParams(filter);

    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper(`/blog?${params.toString()}`);

            return await deserialize<Pagination<Blog>>(response);
        },
        queryKey: ['blog', filter],
    });
};
