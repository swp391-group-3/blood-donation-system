'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { Account } from '@/lib/api/dto/account';
import { Appointment } from '@/lib/api/dto/appointment';
import { useQuery } from '@tanstack/react-query';

export const useAppointmentList = () => {
    return useQuery({
        queryFn: async () => {
            let response = await fetchWrapper('/appointment');

            const raw = await deserialize<Appointment[]>(response);

            const appointments = await Promise.all(
                raw.map((apt) =>
                    (async () => {
                        response = await fetchWrapper(
                            `/account/${apt.member_id}`,
                        );
                        return {
                            ...apt,
                            member: await deserialize<Account>(response),
                        };
                    })(),
                ),
            );

            return appointments;
        },
        queryKey: ['appointment'],
    });
};
