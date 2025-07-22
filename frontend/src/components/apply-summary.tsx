'use client';

import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle,
    Heart,
    RefreshCw,
    Send,
    User,
    XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from '@/lib/service/question';
import {
    answerSchema,
    createAppointment,
    createAppointmentSchema,
} from '@/lib/service/appointment';
import { useMutation } from '@tanstack/react-query';
import { BloodRequest } from '@/lib/service/blood-request';
import z from 'zod';
import { bloodGroupLabels } from '@/lib/service/account';

interface Props {
    request: BloodRequest;
    questions: Question[];
    answers: Record<number, z.infer<typeof answerSchema>>;
    onCancel: () => void;
}

export const ApplySummary = ({
    request,
    questions,
    answers,
    onCancel,
}: Props) => {
    const mutation = useMutation({
        mutationFn: (values: z.infer<typeof createAppointmentSchema>) =>
            createAppointment(request.id, values),
    });

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Review Your Application
                </h1>
                <p className="text-gray-600">
                    Please review your answers before submitting
                </p>
            </div>

            <Card className="mb-8 border-rose-200 bg-rose-50">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-rose-100 rounded-lg">
                            <Heart className="h-5 w-5 text-rose-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-rose-800 mb-2">
                                {request.title}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-rose-700">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>
                                        Blood Types:{' '}
                                        {request.blood_groups
                                            .map(
                                                (group) =>
                                                    bloodGroupLabels[group],
                                            )
                                            .join(', ')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="capitalize font-medium">
                                        {request.priority} Priority
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Your Answers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {questions.map((question, index) => {
                            const answer = answers[index]?.content;

                            return (
                                <div
                                    key={question.id}
                                    className="p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-sm font-medium text-gray-500 mt-1">
                                            Q{index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 mb-2">
                                                {question.content}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {answer === 'yes' ? (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : answer === 'no' ? (
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                ) : answer === 'unsure' ? (
                                                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                                                ) : (
                                                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                                                )}
                                                <span className="text-sm font-medium text-gray-700 capitalize">
                                                    {answer || 'Not answered'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4">
                <Button variant="outline" onClick={onCancel} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Edit
                </Button>
                <Button
                    onClick={() =>
                        mutation.mutate({
                            answers: Object.values(answers),
                        })
                    }
                    disabled={mutation.isPending}
                    className="flex-1 bg-rose-600 hover:bg-rose-700"
                >
                    {mutation.isPending ? (
                        <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Application
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};
