export const statuses = [
    'on_process',
    'approved',
    'checked_in',
    'donated',
    'done',
    'rejected',
] as const;

export type Status = (typeof statuses)[number];

export interface Appointment {
    id: string;
    donor_id: string;
    request_id: string;
    status: Status;
}
