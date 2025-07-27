'use client';

import { buildParams, deserialize, fetchWrapper, Pagination } from '@/lib/api';
import { BloodGroup } from '@/lib/api/dto/blood-group';
import { BloodRequest, Priority } from '@/lib/api/dto/blood-request';
import { useInfiniteScroll } from './use-infinite-scroll';

interface Filter {
    query?: string;
    priority?: Priority;
    blood_group?: BloodGroup;
    page_size?: number;
    page_index?: number;
}

export const useBloodRequestList = (filter: Filter) => {
    return useInfiniteScroll<Filter, BloodRequest>(
        filter,
        async (filter, signal) => {
            const params = buildParams(filter);
            const response = await fetchWrapper(
                `/blood-request?${params.toString()}`,
                { signal },
            );

            return await deserialize<Pagination<BloodRequest>>(response);
        },
    );
};
