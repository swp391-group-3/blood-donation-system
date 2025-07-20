'use server';

export const getApiUrl = async () => {
    return process.env.API_URL || 'http://localhost:3000';
};
