import { BloodGroup } from './blood-group';

export const genders = ['male', 'female'] as const;
export type Gender = (typeof genders)[number];

export type Role = 'donor' | 'staff' | 'admin';

export interface Account {
    id: string;
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

export interface Staff {
    email: string;
    password: string;
    phone: string;
    name: string;
}
