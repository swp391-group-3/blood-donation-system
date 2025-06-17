'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { Donation } from '@/lib/api/dto/donation';
import { useQuery } from '@tanstack/react-query';

export const useCurrentAccountDonation = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper('/donation/me');

            return await deserialize<Donation[]>(response);
        },
        queryKey: ['donation', 'me'],
    });
};
