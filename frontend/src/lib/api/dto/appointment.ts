import { Account } from './account';
import { Answer } from './answer';
import { BloodRequest } from './blood-request';
import { Donation } from './donation';
import { Health } from './health';

export const statuses = [
    'on_process',
    'approved',
    'checked_in',
    'done',
    'rejected',
] as const;

export type Status = (typeof statuses)[number];

export interface Appointment {
    id: string;
    member: Account;
    request: BloodRequest;
    answers: Answer[];
    health: Health;
    donation: Donation;
    status: Status;
}
