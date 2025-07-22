'use client';

import { buildParams, deserialize, fetchWrapper, Pagination } from '@/lib/api';
import { Appointment, Status } from '@/lib/api/dto/appointment';
import { useQuery } from '@tanstack/react-query';

interface Filter {
    query?: string;
    status?: Status;
    page_size?: number;
    page_index?: number;
}

export const useAppointmentList = (filter: Filter) => {
    const params = buildParams(filter);

    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper(
                `/appointment?${params.toString()}`,
            );

            return await deserialize<Pagination<Appointment>>(response);
        },
        queryKey: ['appointment', filter],
    });
};
