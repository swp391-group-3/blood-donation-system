import { deserialize, fetchWrapper } from '@/lib/api';
import { AppointmentStats } from '@/lib/api/dto/appointment';
import { useQuery } from '@tanstack/react-query';

export const useAppointmentStats = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper(`/appointment/stats`);

            return await deserialize<AppointmentStats>(response);
        },
        queryKey: ['appointment', 'stats'],
    });
};
