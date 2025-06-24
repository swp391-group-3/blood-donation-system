import { deserialize, fetchWrapper } from '@/lib/api';
import { Health } from '@/lib/api/dto/health';
import { useQuery } from '@tanstack/react-query';

export const useHealth = (appointmentId: string) => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper(
                `/appointment/${appointmentId}/health`,
            );

            return await deserialize<Health>(response);
        },
        queryKey: ['appointment', appointmentId, 'health'],
    });
};
