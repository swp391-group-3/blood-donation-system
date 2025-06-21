'use client';

import { QuestionCard } from '@/components/question-card';
import { QuestionNavigation } from '@/components/question-navigation';
import { QuestionStatus } from '@/components/question-status';
import { CardTitle } from '@/components/ui/card';
import { useApplyRequest } from '@/hooks/use-apply-request';
import { useQuestion } from '@/hooks/use-question';
import { Answer, AnswerType } from '@/lib/api/dto/answer';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function RequestApplyPage() {
    const { id } = useParams<{ id: string }>();
    const { data: questions, isPending, error } = useQuestion();
    const [answers, setAnswers] = useState<Record<number, Answer>>({});
    const [step, setStep] = useState(0);
    const [showQuestionPanel, setShowQuestionPanel] = useState(true);
    const mutation = useApplyRequest(id);

    if (isPending) {
        return <div></div>;
    }
    if (error) {
        toast.error(error.message);
        return <div></div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div
                className={`flex gap-8 ${showQuestionPanel ? '' : 'justify-center'}`}
            >
                <div
                    className={`${showQuestionPanel ? 'flex-1' : 'max-w-3xl w-full'}`}
                >
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
                {showQuestionPanel && (
                    <div className="hidden lg:block w-80 flex-shrink-0">
                        <QuestionNavigation
                            questions={questions}
                            answers={answers}
                            step={step}
                            onNavigate={(newStep) => setStep(newStep)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
