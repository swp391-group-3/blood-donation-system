import z from 'zod';
import { deserialize, fetchWrapper, throwIfError } from '..';
import { Account, createStaffSchema, updateAccountSchema } from './type';

export const createStaff = async (
    values: z.infer<typeof createStaffSchema>,
) => {
    const response = await fetchWrapper('/account/create-staff', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};

export const getAllAccounts = async (): Promise<Account[]> => {
    const response = await fetchWrapper(`/account`);

    return await deserialize(response);
};
export const getAllAccountsKey = ['account'];

export const getAccount = async (id: string): Promise<Account> => {
    const response = await fetchWrapper(`/account/${id}`);

    return await deserialize(response);
};
export const getAccountKey = (id: string) => ['account', id];

export const isApplied = async (): Promise<boolean> => {
    const response = await fetchWrapper(`/account/is-applied`);

    return await deserialize(response);
};
export const isAppliedKey = ['account', 'is-applied'];

export const getNextDonatableDate = async (): Promise<Date> => {
    const response = await fetchWrapper('/account/next-donatable-date');

    return await deserialize(response);
};
export const getNextDonationDateKey = ['account', 'next-donatable-date'];

export const updateCurrentAccount = async (
    values: z.infer<typeof updateAccountSchema>,
) => {
    const response = await fetchWrapper('/account/me', {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};

export const updateAccount = async (
    id: string,
    values: z.infer<typeof updateAccountSchema>,
) => {
    const response = await fetchWrapper(`/account/${id}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};

export const deleteAccount = async (id: string) => {
    const response = await fetchWrapper(`/account/${id}`, {
        method: 'DELETE',
    });

    await throwIfError(response);
};
