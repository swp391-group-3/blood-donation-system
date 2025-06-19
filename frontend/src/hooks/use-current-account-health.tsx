'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { Health } from '@/lib/api/dto/health';
import { useQuery } from '@tanstack/react-query';

export const useCurrentAccountHealth = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper('/health');

            return await deserialize<Health[]>(response);
        },
        queryKey: ['health'],
    });
};
