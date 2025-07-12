import { deserialize, fetchWrapper } from '@/lib/api';
import { BloodBag } from '@/lib/api/dto/blood-bag';
import { useQuery } from '@tanstack/react-query';

export const useAllBloodBag = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper('/blood-bag');

            return await deserialize<BloodBag[]>(response);
        },
        queryKey: ['blood-bag'],
    });
};
