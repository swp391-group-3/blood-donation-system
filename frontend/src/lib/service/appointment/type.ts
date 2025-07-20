import z from 'zod';

export const statuses = [
    'on_process',
    'approved',
    'checked_in',
    'donated',
    'done',
    'rejected',
] as const;
export type Status = (typeof statuses)[number];

export const answerTypes = ['yes', 'no', 'unsure'] as const;
export type AnswerType = (typeof answerTypes)[number];

export interface Appointment {
    id: string;
    donor_id: string;
    reason: string;
    request_id: string;
    status: Status;
}

export interface Answer {
    question_id: number;
    content?: AnswerType;
}

export interface Answer {
    question: string;
    answer: string;
}

export interface RejectAppointmentData {
    reason: string;
}

export const createAppointmentSchema = z.object({
    answers: z.array(
        z.object({
            question_id: z.number(),
            content: z.string(),
        }),
    ),
});

export interface AppointmentFilter {
    query: string;
    status: Status;
    page_size: number;
    page_index: number;
}

export interface AppointmentStats {
    on_process_appointments: number;
    approved_appointments: number;
    done_appointments: number;
    rejected_appointments: number;
}
