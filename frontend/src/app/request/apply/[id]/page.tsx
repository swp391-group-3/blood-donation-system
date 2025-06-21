'use client';

import { QuestionCard } from '@/components/question-card';
import { QuestionNavigation } from '@/components/question-navigation';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApplyRequest } from '@/hooks/use-apply-request';
import { useQuestion } from '@/hooks/use-question';
import { Answer, AnswerType } from '@/lib/api/dto/answer';
import {
    ArrowLeft,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
    Info,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function RequestApplyPage() {
    const { id } = useParams<{ id: string }>();
    const { data: questions, isPending, error } = useQuestion();
    const [answers, setAnswers] = useState<Record<number, Answer>>({});
    const progress = useMemo(
        () => (Object.keys(answers).length / (questions?.length ?? 0)) * 100,
        [questions, answers],
    );
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
            <div
                className={`flex gap-8 ${showQuestionPanel ? '' : 'justify-center'}`}
            >
                <div
                    className={`space-y-8 ${showQuestionPanel ? 'flex-1' : 'max-w-3xl w-full'}`}
                >
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div></div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setShowQuestionPanel(!showQuestionPanel)
                                }
                                className="hidden lg:flex items-center gap-2"
                            >
                                {showQuestionPanel ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                                {showQuestionPanel ? 'Hide' : 'Show'} Panel
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">
                                    Question {step + 1} of {questions.length}
                                </span>
                                <span className="text-gray-500">
                                    {progress}% complete
                                </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    </div>
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
                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={() => setStep((prev) => prev - 1)}
                            disabled={step === 0}
                            size="lg"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Previous
                        </Button>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Info className="h-4 w-4" />
                            <span>All information is confidential</span>
                        </div>

                        {step === questions?.length - 1 ? (
                            <Button
                                disabled={
                                    Object.keys(answers).length <
                                    questions?.length
                                }
                                className="bg-rose-600 hover:bg-rose-700"
                                size="lg"
                            >
                                Review Application
                                <CheckCircle className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setStep((prev) => prev + 1)}
                                className="bg-rose-600 hover:bg-rose-700"
                                size="lg"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        )}
                    </div>
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
