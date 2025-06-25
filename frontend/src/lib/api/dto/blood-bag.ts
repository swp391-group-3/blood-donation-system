export const bloodComponents = ['red_cell', 'platelet', 'plasma'] as const;

export const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as const;

export type BloodComponent = (typeof bloodComponents)[number];

export type BloodGroup = (typeof bloodGroups)[number];
export interface BloodBag {
    id: string,
    donation_id: string,
    component: BloodComponent,
    is_used: boolean,
    amount: number,
    expired_time: Date,
    blood_group: BloodGroup;
}
