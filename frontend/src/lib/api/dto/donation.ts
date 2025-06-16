import { capitalCase } from 'change-case';

export const donationTypes = [
    'whole_blood',
    'power_red',
    'platelet',
    'plasma',
] as const;

export type DonationType = (typeof donationTypes)[number];

export const displayDonationType = (donationType: DonationType): string =>
    capitalCase(donationType);

export interface Donation {
    id: string;
    appointment_id: string;
    amount: number;
    type: DonationType;
    created_ad: Date;
}
