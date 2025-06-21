export const answerTypes = ['yes', 'no', 'unsure'] as const;

export type AnswerType = (typeof answerTypes)[number];

export interface Answer {
    question_id: number;
    content: AnswerType;
}
