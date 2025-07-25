'use client';

import { buildParams, deserialize, fetchWrapper, Pagination } from '@/lib/api';
import { Blog } from '@/lib/api/dto/blog';
import { useInfiniteScroll } from './use-infinite-scroll';

export type Mode = 'MostRecent' | 'OldestFirst' | 'TitleAZ';

interface Filter {
    query?: string;
    tag?: string;
    mode?: Mode;
    page_index?: number;
    page_size?: number;
}

export const useBlogList = (filter: Filter) => {
    return useInfiniteScroll<Filter, Blog>(filter, async (filter) => {
        const params = buildParams(filter);
        const response = await fetchWrapper(`/blog?${params.toString()}`);

        return await deserialize<Pagination<Blog>>(response);
    });
};
