import z from 'zod';
import { buildParams, deserialize, fetchWrapper, throwIfError } from '..';
import {
    BloodBagFilter,
    BloodBag,
    updateBloodBagSchema,
    createBloogBagSchema,
    BloodBagStats,
} from './type';

export const getBloodBagStats = async (): Promise<BloodBagStats> => {
    const response = await fetchWrapper('/blood-bag/stats');

    return await deserialize(response);
};
export const getBloodBagStatsKey = ['blood-bag', 'stats'];

export const createBloodBag = async (
    values: z.infer<typeof createBloogBagSchema>,
) => {
    const response = await fetchWrapper('/blood-bag', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};

export const getAllBloodBags = async (
    filter: BloodBagFilter,
): Promise<BloodBag[]> => {
    const params = buildParams(filter).toString();

    const response = await fetchWrapper(`/blood-bag?${params}`);

    return await deserialize(response);
};
export const getAllBloodBagsKey = (filter: BloodBagFilter) => [
    'blood-bag',
    filter,
];

export const getBloodBag = async (id: string): Promise<BloodBag> => {
    const response = await fetchWrapper(`/blood-bag/${id}`);

    return await deserialize(response);
};
export const getBloodBagKey = (id: string) => ['blood-bag', id];

export const updateBloodBag = async (
    id: string,
    values: z.infer<typeof updateBloodBagSchema>,
) => {
    const response = await fetchWrapper(`/blood-bag/${id}`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};

export const deleteBloogBag = async (id: string) => {
    const response = await fetchWrapper(`/blood-bag/${id}`, {
        method: 'DELETE',
    });

    await throwIfError(response);
};
