import { deserialize, fetchWrapper } from '..';
import { BloodGroup } from '../account';
import { DashboardStats } from './type';

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await fetchWrapper('/dashboard/stats');

    return await deserialize(response);
};
export const getDashboardStatsKey = ['dashboard', 'stats'];

export const getAllBloodGroup = async (): Promise<BloodGroup[]> => {
    const response = await fetchWrapper('/dashboard/blood-group-distribution');

    return await deserialize(response);
};
export const getAllBloodGroupKey = ['dashboard', 'blood-group-distribution'];

export const getDonationTrend = async (): Promise<Date[]> => {
    const response = await fetchWrapper('/dashboard/donation-trends');

    return await deserialize(response);
};
export const getDonationTrendKey = ['dashboard', 'donation-trends'];

export const getRequestTrend = async (): Promise<Date[]> => {
    const response = await fetchWrapper('/dashboard/request-trends');

    return await deserialize(response);
};
export const getRequestTrendKey = ['dashboard', 'request-trends'];
