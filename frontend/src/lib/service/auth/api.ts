import z from 'zod';
import { deserialize, fetchWrapper, throwIfError } from '..';
import {
    completeOAuth2Schema,
    loginSchema,
    OAuth2Provider,
    registerSchema,
} from './type';
import { Account } from '../account';
import { getApiUrl } from '../api-url';
import { redirect } from 'next/navigation';

export const register = async (values: z.infer<typeof registerSchema>) => {
    const response = await fetchWrapper('/auth/register', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};

export const completeOAuth2 = async (
    values: z.infer<typeof completeOAuth2Schema>,
) => {
    const response = await fetchWrapper('/oauth2/complete', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};

export const oauth2 = async (provider: OAuth2Provider) => {
    const apiUrl = await getApiUrl();

    redirect(`${apiUrl}/oauth2/${provider}`);
};

export const login = async (values: z.infer<typeof loginSchema>) => {
    const response = await fetchWrapper('/auth/login', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};

export const logout = async () => {
    const response = await fetchWrapper('/auth/logout', {
        method: 'POST',
    });

    await throwIfError(response);
};

export const getCurrentAccount = async (): Promise<Account> => {
    const response = await fetchWrapper('/auth/me');

    return await deserialize(response);
};
export const getCurrentAccountKey = ['auth', 'me'];
