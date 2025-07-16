import { BloodGroup } from './blood-group';

export const priorities = ['low', 'medium', 'high'] as const;

export type Priority = (typeof priorities)[number];

export interface BloodRequest {
    id: string;
    priority: Priority;
    title: string;
    blood_groups: BloodGroup[];
    current_people: number;
    max_people: number;
    start_time: Date;
    end_time: Date;
    is_editable: boolean;
}
