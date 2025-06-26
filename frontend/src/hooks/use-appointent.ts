'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { Account } from '@/lib/api/dto/account';
import { Appointment } from '@/lib/api/dto/appointment';
import { BloodRequest } from '@/lib/api/dto/blood-request';
import { useQuery } from '@tanstack/react-query';

export const useAppointment = (id: string) => {
    return useQuery({
        queryFn: async () => {
            let response = await fetchWrapper(`/appointment/${id}`);
            const appointment = await deserialize<Appointment>(response);

            const [member, request, answers] = await Promise.all([
                (async () => {
                    response = await fetchWrapper(
                        `/account/${appointment.member_id}`,
                    );
                    return await deserialize<Account>(response);
                })(),
                (async () => {
                    response = await fetchWrapper(
                        `/blood-request/${appointment.request_id}`,
                    );
                    return await deserialize<BloodRequest>(response);
                })(),
                (async () => {
                    response = await fetchWrapper(`/appointment/${id}/answer`);
                    return await deserialize<
                        { answer: string; question: string }[]
                    >(response);
                })(),
            ]);

            return {
                ...appointment,
                member,
                request,
                answers,
            };
        },
        queryKey: ['appointment', id],
    });
};
