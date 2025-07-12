import { deserialize, fetchWrapper } from '@/lib/api';
import { Donation } from '@/lib/api/dto/donation';
import { useQuery } from '@tanstack/react-query';

export const useAllDonation = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper('/donation');

            return await deserialize<Donation[]>(response);
        },
        queryKey: ['donation'],
    });
};
