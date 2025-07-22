'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { Tag } from '@/lib/api/dto/tag';
import { useQuery } from '@tanstack/react-query';

export const useTagList = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper('/tag');

            return await deserialize<Tag[]>(response);
        },
        queryKey: ['tag'],
    });
};
