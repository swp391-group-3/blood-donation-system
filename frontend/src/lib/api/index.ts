import { getApiUrl } from './api-url';

export class ApiError extends Error {
    details: Record<string, string>;

    constructor(message: string, details: Record<string, string>) {
        super(message);
        this.details = details;
    }
}

export const throwIfError = async (response: Response) => {
    if (!response.ok) {
        const error: ApiError = await response.json();
        throw error;
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

    const apiUrl = `${base}${url}`;

    return await fetch(apiUrl, {
        ...init,
        credentials: 'include',
    });
};

export interface Pagination<T> {
    element_count: number;
    data: T[];
}

export const buildParams = (data: object) => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(data)) {
        if (value) {
            params.append(key, value);
        }
    }

    return params;
};
