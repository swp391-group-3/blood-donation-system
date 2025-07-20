import z from 'zod';

export interface Health {
    id: string;
    appointment_id: string;
    heart_rate: number;
    temperature: number;
    weight: number;
    lower_blood_pressure: number;
    upper_blood_pressure: number;
    note?: string;
    is_good_health: string;
    created_at: Date;
}

export const createHealthSchema = z
    .object({
        heart_rate: z.number({ coerce: true }).int(),
        is_good_health: z.boolean(),
        lower_blood_pressure: z.number({ coerce: true }).int(),
        note: z.string().optional(),
        temperature: z.number({ coerce: true }),
        upper_blood_pressure: z.number({ coerce: true }).int(),
        weight: z.number({ coerce: true }).int(),
    })
    .refine((data) => data.lower_blood_pressure < data.upper_blood_pressure, {
        message: 'upper blood pressure must be > lower blood pressure',
        path: ['upper_blood_pressure', 'lower_blood_pressure'],
    });

export const updateHealthSchema = z.object({
    heart_rate: z.number({ coerce: true }).int().optional(),
    is_good_health: z.boolean().optional(),
    lower_blood_pressure: z.number({ coerce: true }).int().optional(),
    note: z.string().optional(),
    temperature: z.number({ coerce: true }).optional(),
    upper_blood_pressure: z.number({ coerce: true }).int().optional(),
    weight: z.number({ coerce: true }).int().optional(),
});
