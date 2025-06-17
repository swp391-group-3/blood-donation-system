import { BloodGroup } from "./blood-group";

export const genders = ['male', 'female'] as const;

export type Gender = (typeof genders)[number];

export const displayGender = (gender: Gender): string => {
    return gender.charAt(0).toUpperCase() + gender.substring(1).toLowerCase();
};

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
