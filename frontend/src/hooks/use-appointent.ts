'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { Account } from '@/lib/api/dto/account';
import { Appointment } from '@/lib/api/dto/appointment';
import { BloodRequest } from '@/lib/api/dto/blood-request';
import { Donation } from '@/lib/api/dto/donation';
import { useQuery } from '@tanstack/react-query';

export const useAppointment = (id: string) => {
    return useQuery({
        queryFn: async () => {
            let response = await fetchWrapper(`/appointment/${id}`);
            const appointment = await deserialize<Appointment>(response);

            const [donor, request, answers, donation] = await Promise.all([
                (async () => {
                    response = await fetchWrapper(
                        `/account/${appointment.donor_id}`,
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
                (async () => {
                    response = await fetchWrapper(
                        `/appointment/${id}/donation`,
                    );
                    return await deserialize<Donation>(response);
                })(),
            ]);

            return {
                ...appointment,
                donor,
                request,
                answers,
                donation,
            };
        },
        queryKey: ['appointment', id],
    });
};
