import { deserialize, fetchWrapper } from '@/lib/api';
import { BloodRequestStats } from '@/lib/api/dto/blood-request';
import { useQuery } from '@tanstack/react-query';

export const useBloodRequestStats = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper(`/blood-request/stats`);

            return await deserialize<BloodRequestStats>(response);
        },
        queryKey: ['blood-request', 'stats'],
    });
};
