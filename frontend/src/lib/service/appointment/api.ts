import z from 'zod';
import { buildParams, deserialize, fetchWrapper, throwIfError } from '..';
import {
    Answer,
    Appointment,
    AppointmentFilter,
    createAppointmentSchema,
    RejectAppointmentData,
} from './type';

export const createAppointment = async (
    requestId: string,
    values: z.infer<typeof createAppointmentSchema>,
) => {
    const response = await fetchWrapper(
        `/blood-request/${requestId}/create-appointment`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        },
    );

    await throwIfError(response);
};

export const getAllAppointments = async (
    filter: AppointmentFilter,
): Promise<Appointment[]> => {
    const params = buildParams(filter).toString();
    const response = await fetchWrapper(`/appointment?${params}`);

    return await deserialize(response);
};
export const getAllAppointmentsKey = (filter: AppointmentFilter) => [
    'appointment',
    filter,
];

export const getCurrentAccountAppointments = async (): Promise<
    Appointment[]
> => {
    const response = await fetchWrapper('/appointment/me');

    return await deserialize(response);
};
export const getCurrentAccountAppointmentsKey = ['appointment', 'me'];

export const getAppointment = async (id: string): Promise<Appointment> => {
    const response = await fetchWrapper(`/appointment/${id}`);

    return await deserialize(response);
};
export const getAppointmentKey = (id: string) => ['appointment', id];

export const getAppointmentAnswers = async (id: string): Promise<Answer[]> => {
    const response = await fetchWrapper(`/appointment/${id}/answer`);

    return await deserialize(response);
};
export const getAppointmentAnswersKey = (id: string) => [
    'appointment',
    id,
    'answer',
];

export const approveAppointment = async (id: string) => {
    const response = await fetchWrapper(`/appointment/${id}/approve`, {
        method: 'PATCH',
    });

    await throwIfError(response);
};

export const completeAppointment = async (id: string) => {
    const response = await fetchWrapper(`/appointment/${id}/done`, {
        method: 'PATCH',
    });

    await throwIfError(response);
};

export const rejectAppointment = async (
    id: string,
    data: RejectAppointmentData,
) => {
    const response = await fetchWrapper(`/appointment/${id}/reject`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    await throwIfError(response);
};
