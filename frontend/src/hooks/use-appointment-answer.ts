'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';


export const useAppointmentAnswer = (id: string) => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper(`/appointment/${id}/answer`);

            return await deserialize<{ answer: string; question: string }[]>(
                response,
            );
        },
        queryKey: ['appointment', id, 'answer'],
    });
};
