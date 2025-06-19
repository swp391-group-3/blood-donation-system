import { BloodGroup } from './blood-group';

export const genders = ['male', 'female'] as const;
export type Gender = (typeof genders)[number];

export type Role = 'member' | 'staff' | 'admin';

export interface Account {
    role: Role;
    email: string;
    name: string;
    phone: string;
    address: string;
    birthday: string;
    blood_group: BloodGroup;
    gender: Gender;
    created_at: Date;
}
