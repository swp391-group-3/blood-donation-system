'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { BloodRequest } from '@/lib/api/dto/blood-request';
import { useQuery } from '@tanstack/react-query';

export const useBloodRequest = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper('/blood-request');

            return await deserialize<BloodRequest[]>(response);
        },
        queryKey: ['blood-request'],
    });
};
