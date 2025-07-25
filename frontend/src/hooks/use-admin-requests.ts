import { deserialize, fetchWrapper } from '@/lib/api';
import { BloodRequestTrend } from '@/lib/dashboard-utils';
import { useQuery } from '@tanstack/react-query';

export const useAdminRequest = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper('/dashboard/request-trends');

            return await deserialize<BloodRequestTrend[]>(response);
        },
        queryKey: ['/dashboard/request-trends'],
    });
};
