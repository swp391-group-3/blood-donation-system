import z from 'zod';
import { BloodGroup, bloodGroups } from '../account';

export const priorities = ['low', 'medium', 'high'] as const;
export type Priority = (typeof priorities)[number];

export interface BloodRequest {
    id: string;
    priority: Priority;
    title: string;
    max_people: number;
    start_time: Date;
    end_time: Date;
    is_active: boolean;
    created_at: Date;
    blood_groups: BloodGroup[];
    current_people: number;
    is_editable: boolean;
}

export interface BloodRequestStats {
    total_requests: number;
    urgent_requests: number;
    donors_needed: number;
    recommended_requests: number;
}

export const createBloodRequestSchema = z.object({
    title: z.string().min(1, 'The title cannot be empty'),
    priority: z.enum(priorities, {
        errorMap: () => ({ message: 'Invalid Priority' }),
    }),
    blood_groups: z
        .array(
            z.enum(bloodGroups, {
                errorMap: () => ({ message: 'Invalid Blood Group' }),
            }),
        )
        .min(1, 'At least one blood group'),
    max_people: z.number().min(1, 'At least one people'),
    start_time: z.date(),
    end_time: z.date(),
});

export const updateBloodRequestSchema = z.object({
    title: z.string().min(1, 'The title cannot be empty').optional(),
    priority: z
        .enum(priorities, {
            errorMap: () => ({ message: 'Invalid Priority' }),
        })
        .optional(),
    max_people: z.number().min(1, 'At least one people').optional(),
});
