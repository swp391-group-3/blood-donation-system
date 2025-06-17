import { BloodGroup } from './blood-group';
import { capitalCase } from 'change-case';

export const priorities = ['low', 'medium', 'high'] as const;

export type Priority = (typeof priorities)[number];

export const displayPriority = (priority: Priority) => capitalCase(priority);

export interface BloodRequest {
    blood_groups: BloodGroup[];
    priority: Priority;
    title: string;
    current_people: number;
    max_people: number;
    start_time: Date;
    end_time: Date;
}
