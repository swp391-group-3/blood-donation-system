export const bloodComponents = ['red_cell', 'platelet', 'plasma'] as const;

export type BloodComponent = (typeof bloodComponents)[number];

export interface BloodBag {
    amount: number;
    component: BloodComponent;
    expired_time: Date;
}
