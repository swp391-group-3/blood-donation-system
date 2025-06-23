'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { Appointment } from '@/lib/api/dto/appointment';
import { useQuery } from '@tanstack/react-query';

export const useAppointment = (id: string) => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper(`/appointment/${id}`);

            return await deserialize<Appointment>(response);
        },
        queryKey: ['appointment', id],
    });
};
