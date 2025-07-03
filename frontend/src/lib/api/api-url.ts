'use server';

export const getApiUrl = async () => {
    return process.env.API_URL || 'bds-api.akagiyuu.dev';
};
