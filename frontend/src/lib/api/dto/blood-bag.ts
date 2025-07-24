import { BloodGroup } from './blood-group';

export const bloodComponents = ['red_cell', 'platelet', 'plasma'] as const;

export type BloodComponent = (typeof bloodComponents)[number];
export interface BloodBag {
    id: string;
    donation_id: string;
    component: BloodComponent;
    is_used: boolean;
    amount: number;
    expired_time: Date;
    blood_group: BloodGroup;
}

export interface CreateBloodBag {
    amount: number;
    expired_time: Date;
    component: BloodComponent;
}

export interface BloodBagStats {
    total_bags: number;
    available_bags: number;
    expiring_bags: number;
    expired_bags: number;
}
