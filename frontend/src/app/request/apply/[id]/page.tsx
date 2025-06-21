'use client';

import { QuestionCard } from '@/components/question-card';
import { CardTitle } from '@/components/ui/card';
import { useApplyRequest } from '@/hooks/use-apply-request';
import { useQuestion } from '@/hooks/use-question';
import { AnswerType } from '@/lib/api/dto/answer';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function RequestApplyPage() {
    const { id } = useParams<{ id: string }>();
    const { data: questions, isPending, error } = useQuestion();
    const [answers, setAnswers] = useState<
        Record<number, { question_id: number; content: AnswerType | undefined }>
    >({});
    const [step, setStep] = useState(0);
    const mutation = useApplyRequest(id);

    if (isPending) {
        return <div></div>;
    }
    if (error) {
        toast.error(error.message);
        return <div></div>;
    }

    return (
        <div>
            <QuestionCard
                value={answers[step]?.content}
                onChange={(value) => {
                    setAnswers((prev) => ({
                        ...prev,
                        [step]: {
                            question_id: questions[step].id,
                            content: value,
                        },
                    }));
                }}
            >
                <CardTitle>{questions[step].content}</CardTitle>
            </QuestionCard>
        </div>
    );
}
