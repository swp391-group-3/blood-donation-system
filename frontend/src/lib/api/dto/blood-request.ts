import { BloodGroup } from './blood-group';

export const priorities = ['low', 'medium', 'high'] as const;

export type Priority = (typeof priorities)[number];

export interface BloodRequest {
    id: string;
    blood_groups: BloodGroup[];
    priority: Priority;
    title: string;
    current_people: number;
    max_people: number;
    start_time: Date;
    end_time: Date;
}
