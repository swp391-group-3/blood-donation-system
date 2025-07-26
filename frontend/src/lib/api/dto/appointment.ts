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
    reason: string;
    request_id: string;
    status: Status;
}

export interface AppointmentStats {
    on_process_appointments: number;
    approved_appointments: number;
    done_appointments: number;
    rejected_appointments: number;
}
