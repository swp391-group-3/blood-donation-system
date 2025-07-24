import { deserialize, fetchWrapper } from '@/lib/api';
import { BloodBagStats } from '@/lib/api/dto/blood-bag';
import { useQuery } from '@tanstack/react-query';

export const useBloodBagStats = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper(`/blood-bag/stats`);

            return await deserialize<BloodBagStats>(response);
        },
        queryKey: ['blood-bag', 'stats'],
    });
};
