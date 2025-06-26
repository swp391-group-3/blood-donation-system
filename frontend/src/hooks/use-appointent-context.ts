'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { Account } from '@/lib/api/dto/account';
import { Appointment } from '@/lib/api/dto/appointment';
import { BloodRequest } from '@/lib/api/dto/blood-request';
import { useQuery } from '@tanstack/react-query';

export const useAppointmentDetail = (appointment: Appointment) => {
    return useQuery({
        queryFn: async () => {
            let response = await fetchWrapper(
                `/account/${appointment.member_id}`,
            );
            const account = await deserialize<Account>(response);

            response = await fetchWrapper(
                `/blood-request/${appointment.request_id}`,
            );
            const request = await deserialize<BloodRequest>(response);

            return {
                appointment,
                account,
                request,
            };
        },
        queryKey: ['appointment', appointment.id, 'detail'],
    });
};
