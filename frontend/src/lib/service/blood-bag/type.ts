import z from 'zod';
import { BloodGroup } from '../account';

export const modes = ['Compatible', 'Exact'] as const;
export type Mode = (typeof modes)[number];

export const components = ['red_cell', 'platelet', 'plasma'] as const;
export type Component = (typeof components)[number];

export interface BloodBagFilter {
    component?: Component;
    blood_group?: BloodGroup;
    mode?: Mode;
    page_size?: number;
    page_index?: number;
}

export interface BloodBag {
    id: string;
    donation_id: string;
    component: Component;
    is_used: boolean;
    amount: number;
    expired_time: Date;
    blood_group: BloodGroup;
}

export interface BloodBagStats {
    total_bags: number;
    available_bags: number;
    expiring_bags: number;
    expired_bags: number;
}

export const createBloogBagSchema = z.object({
    amount: z.coerce.number().int(),
    component: z.enum(components),
    expired_time: z.date(),
});

export const updateBloodBagSchema = z.object({
    amount: z.coerce.number().int().optional(),
    component: z.enum(components).optional(),
    expired_time: z.date().optional(),
});
