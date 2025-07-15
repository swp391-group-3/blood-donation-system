'use client';
import { fetchWrapper } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const useNextDonatableDate = () => {
    return useQuery({
        queryKey: ['account', 'next-donatable-date'],
        queryFn: async () => {
            const response = await fetchWrapper('/account/next-donatable-date');
            const dateStr = await response.json();
            return new Date(dateStr);
        },
    });
};
