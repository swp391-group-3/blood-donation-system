'use client';

import { buildParams, deserialize, fetchWrapper, Pagination } from '@/lib/api';
import { BloodGroup } from '@/lib/api/dto/blood-group';
import { BloodRequest, Priority } from '@/lib/api/dto/blood-request';
import { useQuery } from '@tanstack/react-query';

interface Filter {
    query?: string;
    priority?: Priority;
    blood_group: BloodGroup;
    page_size?: number;
    page_index?: number;
}

export const useBloodRequestList = (filter: Filter) => {
    const params = buildParams(filter);

    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper(
                `/blood-request/${params.toString()}`,
            );

            return await deserialize<Pagination<BloodRequest>>(response);
        },
        queryKey: ['blood-request', filter],
    });
};
