import z from 'zod';
import { deserialize, fetchWrapper, QueryData, throwIfError } from '..';
import { createDonationSchema, Donation, updateDonationSchema } from './type';

export const createDonation = async (
    appointmentId: string,
    values: z.infer<typeof createDonationSchema>,
) => {
    const response = await fetchWrapper(
        `/appointment/${appointmentId}/donation`,
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

export const getAllDonations = async (): Promise<Donation[]> => {
    const response = await fetchWrapper('/donation');

    return await deserialize(response);
};
export const getAllDonationsKey = ['donation'];

export const getCurrentAccountDonations = async (): Promise<Donation[]> => {
    const response = await fetchWrapper('/donation/me');

    return await deserialize(response);
};
export const getCurrentAccountDonationsKey = ['donation', 'me'];

export const getDonationByAppointmentId = async (
    appointmentId: string,
): Promise<Donation> => {
    const response = await fetchWrapper(
        `/appointment/${appointmentId}/donation`,
    );

    return await deserialize(response);
};
export const getDonationByAppointmentIdKey = (appointmentId: string) => [
    'appointment',
    appointmentId,
    'donation',
];

export const getDonation = async (id: string): Promise<Donation> => {
    const response = await fetchWrapper(`/donation/${id}`);

    return await deserialize(response);
};
export const getDonationKey = (id: string) => ['donation', id];

export const updateDonation = async (
    id: string,
    values: z.infer<typeof updateDonationSchema>,
) => {
    const response = await fetchWrapper(`/donation/${id}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};
