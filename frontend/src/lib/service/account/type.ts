import { registerSchema } from '../auth';

export const bloodGroups = [
    'o_plus',
    'o_minus',
    'a_plus',
    'a_minus',
    'b_plus',
    'b_minus',
    'a_b_plus',
    'a_b_minus',
] as const;
export type BloodGroup = (typeof bloodGroups)[number];
export const bloodGroupLabels: {
    [key in BloodGroup]: string;
} = {
    o_plus: 'O+',
    o_minus: 'O-',
    a_plus: 'A+',
    a_minus: 'A-',
    b_plus: 'B+',
    b_minus: 'B-',
    a_b_plus: 'AB+',
    a_b_minus: 'AB-',
};

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

export const createStaffSchema = registerSchema.pick({
    email: true,
    name: true,
    password: true,
    phone: true,
});

export const updateAccountSchema = registerSchema.omit({
    email: true,
    password: true,
    blood_group: true,
});
