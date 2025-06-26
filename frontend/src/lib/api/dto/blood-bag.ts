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
