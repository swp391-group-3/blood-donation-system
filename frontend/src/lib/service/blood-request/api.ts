import z from 'zod';
import { deserialize, fetchWrapper, throwIfError } from '..';
import {
    BloodRequest,
    BloodRequestStats,
    createBloodRequestSchema,
    updateBloodRequestSchema,
} from './type';
import { AppointmentStats } from '../appointment';

export const getAppointmentStats = async (): Promise<AppointmentStats> => {
    const response = await fetchWrapper('/appointment/stats');

    return await deserialize(response);
};

export const getBloodRequestStats = async (): Promise<BloodRequestStats> => {
    const response = await fetchWrapper('/blood-request/stats');

    return await deserialize(response);
};

export const createBloogRequest = async (
    values: z.infer<typeof createBloodRequestSchema>,
) => {
    const response = await fetchWrapper('/blood-request', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};

export const getAllBloodRequests = async (): Promise<BloodRequest> => {
    const response = await fetchWrapper('/blood-request');

    return await deserialize(response);
};
export const getAllBloodRequestsKey = ['blood-request'];

export const getBloodRequest = async (id: string): Promise<BloodRequest> => {
    const response = await fetchWrapper(`/blood-request/${id}`);

    return await deserialize(response);
};
export const getBloodRequestKey = (id: string) => ['blood-request', id];

export const updateBloodRequest = async (
    id: string,
    values: z.infer<typeof updateBloodRequestSchema>,
) => {
    const response = await fetchWrapper(`/blood-request/${id}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};

export const deleteBloodRequest = async (id: string) => {
    const response = await fetchWrapper(`/blood-request/${id}`, {
        method: 'DELETE',
    });

    await throwIfError(response);
};
