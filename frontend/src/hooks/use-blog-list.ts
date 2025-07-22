'use client';

import { buildParams, deserialize, fetchWrapper, Pagination } from '@/lib/api';
import { Blog } from '@/lib/api/dto/blog';
import { useQuery } from '@tanstack/react-query';

export type Mode = 'MostRecent' | 'OldestFirst' | 'TitleAZ';

interface Filter {
    query?: string;
    tag?: string;
    mode?: Mode;
    page_index?: number;
    page_size?: number;
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
