import { deserialize, fetchWrapper } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface AdminStats {
    total_users: number;
    total_donations: number;
    active_blood_requests: number;
    available_blood_bags: number;
}
export const useAdminStats = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper('/dashboard/stats');

            return await deserialize<AdminStats>(response);
        },
        queryKey: ['/dashboard/stats'],
    });
};
