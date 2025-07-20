import z from 'zod';

export const donationTypes = [
    'whole_blood',
    'power_red',
    'platelet',
    'plasma',
] as const;
export type DonationType = (typeof donationTypes)[number];

export interface Donation {
    id: string;
    appointment_id: string;
    type: DonationType;
    amount: number;
    created_at: Date;
}

export const createDonationSchema = z.object({
    type: z.enum(donationTypes),
    amount: z.coerce.number().int(),
});

export const updateDonationSchema = z.object({
    type: z.enum(donationTypes).optional(),
    amount: z.coerce.number().int().optional(),
});
