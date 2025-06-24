import { deserialize, fetchWrapper } from '@/lib/api';
import { BloodRequest } from '@/lib/api/dto/blood-request';
import { useQuery } from '@tanstack/react-query';

export const useBloodRequest = (id?: string) => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper(`/blood-request/${id}`);

            return await deserialize<BloodRequest>(response);
        },
        queryKey: ['blood-request', id],
        enabled: !!id,
    });
};
