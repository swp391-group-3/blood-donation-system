'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { Account } from '@/lib/api/dto/account';
import { Appointment } from '@/lib/api/dto/appointment';
import { useQuery } from '@tanstack/react-query';

export const useAppointment = (id: string) => {
    return useQuery({
        queryFn: async () => {
            let response = await fetchWrapper(`/appointment/${id}`);
            let raw = await deserialize<Appointment>(response);

            response = await fetchWrapper(`/account/${raw.member_id}`);
            const appointment = {
                ...raw,
                member: await deserialize<Account>(response),
            };

            return appointment;
        },
        queryKey: ['account', 'id'],
    });
};
