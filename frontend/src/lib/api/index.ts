import { getApiUrl } from './api-url';

export const throwIfError = async (response: Response) => {
    if (!response.ok) {
        const error = await response.text();

        throw new Error(error);
    }
};

export const deserialize = async <T>(response: Response): Promise<T> => {
    await throwIfError(response);

    const data: T = await response.json();
    return data;
};

export const fetchWrapper = async (
    url: RequestInfo | URL,
    init?: RequestInit,
) => {
    const base = await getApiUrl();

    const fullBase = base.startsWith('http') ? base : `https://${base}`;

    const apiUrl = `${fullBase}${url}`;

    return await fetch(apiUrl, {
        ...init,
        credentials: 'include',
    });
};
