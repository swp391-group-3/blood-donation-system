import { deserialize, fetchWrapper } from '@/lib/api';
import { Donation } from '@/lib/api/dto/donation';
import { useQuery } from '@tanstack/react-query';

export const useDonation = (appointmentId?: string) => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper(
                `/appointment/${appointmentId}/donation`,
            );

            return await deserialize<Donation>(response);
        },
        queryKey: ['appointment', appointmentId, 'donation'],
        enabled: !!appointmentId,
    });
};
