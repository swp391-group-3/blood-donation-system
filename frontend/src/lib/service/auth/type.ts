import z from 'zod';
import { bloodGroups, genders } from '../account';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().nonempty({
        message: 'Password must not be empty.',
    }),
    name: z.string().min(1, { message: 'Name must be provided.' }),
    phone: z
        .string()
        .regex(/0[\d]{9,9}/, { message: 'Phone must consist of 10 number' }),
    address: z.string().min(1, { message: 'Address must be provided.' }),
    birthday: z.string(),
    blood_group: z.enum(bloodGroups),
    gender: z.enum(genders),
});

export const completeOAuth2Schema = registerSchema.omit({
    email: true,
    password: true,
});

export const loginSchema = registerSchema.pick({
    email: true,
    password: true,
});

export type OAuth2Provider = 'google' | 'microsoft';
