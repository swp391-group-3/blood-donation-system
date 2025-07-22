import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Question } from '@/lib/service/question';
import { answerSchema } from '@/lib/service/appointment';
import z from 'zod';

const configs = {
    yes: {
        color: 'text-green-700 bg-green-100 border-green-300',
    },
    no: {
        color: 'text-red-700 bg-red-100 border-red-300',
    },
    unsure: {
        color: 'text-amber-700 bg-amber-100 border-amber-300',
    },
};

interface Props {
    questions: Question[];
    answers: Record<number, z.infer<typeof answerSchema>>;
    step: number;
    onNavigate: (newStep: number) => void;
}

export const QuestionNavigation = ({
    questions,
    answers,
    step,
    onNavigate,
}: Props) => {
    const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

    const getQuestionStatus = (index: number) => {
        if (index === step) return 'current';

        const answerContent = answers[index]?.content;
        if (answerContent) return 'answered';
        return 'unanswered';
    };

    return (
        <Card className="sticky top-8">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                        Progress
                    </CardTitle>
                    <Badge variant="outline" className="text-sm">
                        {answeredCount}/{questions.length}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {questions.map((question, index) => {
                    const answer = answers[index]?.content;
                    const status = getQuestionStatus(index);
                    const isCurrentQuestion = index === step;

                    return (
                        <div
                            key={question.id}
                            onClick={() => onNavigate(index)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${
                                isCurrentQuestion
                                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                                    : status === 'answered'
                                      ? 'border-green-200 bg-green-50 hover:bg-green-100'
                                      : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                    {status === 'answered' && (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    )}

                                    {status === 'current' && (
                                        <div className="h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center">
                                            <div className="h-2 w-2 rounded-full bg-white"></div>
                                        </div>
                                    )}

                                    {status === 'unanswered' && (
                                        <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-gray-900">
                                            Q{index + 1}
                                        </span>
                                        {isCurrentQuestion && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                Current
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                        {question.content}
                                    </p>
                                    {answer && (
                                        <div
                                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${configs[answer].color ?? 'text-gray-500 bg-gray-100 border-gray-300'}`}
                                        >
                                            {answer === 'yes' && (
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                            )}
                                            {answer === 'no' && (
                                                <XCircle className="h-3 w-3 mr-1" />
                                            )}
                                            {answer === 'unsure' && (
                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                            )}
                                            <span className="capitalize">
                                                {answer}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};
