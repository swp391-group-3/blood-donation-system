import z from 'zod';
import { deserialize, fetchWrapper, QueryData, throwIfError } from '..';
import { createHealthSchema, Health, updateHealthSchema } from './type';

export const createHealth = async (
    appointmentId: string,
    values: z.infer<typeof createHealthSchema>,
) => {
    const response = await fetchWrapper(
        `/appointment/${appointmentId}/health`,
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

export const getHealths = async (): Promise<Health[]> => {
    const response = await fetchWrapper('/health');

    return await deserialize(response);
};
export const getHealthsKey = ['health'];

export const getHealth = async (appointmentId: string): Promise<Health> => {
    const response = await fetchWrapper(`/appointment/${appointmentId}/health`);

    return await deserialize(response);
};
export const getHealthKey = (appointmentId: string) => [
    'appointment',
    appointmentId,
    'health',
];

export const updateHealth = async (
    id: string,
    values: z.infer<typeof updateHealthSchema>,
) => {
    const response = await fetchWrapper(`/health/${id}`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};
