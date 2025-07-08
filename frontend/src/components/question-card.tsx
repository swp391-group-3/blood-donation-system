'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AnswerType, answerTypes } from '@/lib/api/dto/answer';
import { PropsWithChildren } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Props {
    className?: string;
    value: AnswerType | '';
    onChange: (value: AnswerType) => void;
}

const configs = {
    yes: {
        textColor: 'text-green-600',
        bgColor: 'border-green-500 bg-green-50',
        icon: CheckCircle,
    },
    no: {
        textColor: 'text-red-600',
        bgColor: 'border-red-500 bg-red-50',
        icon: XCircle,
    },
    unsure: {
        textColor: 'text-amber-600',
        bgColor: 'border-amber-500 bg-amber-50',
        icon: AlertTriangle,
    },
};

export const QuestionCard = ({
    children,
    className,
    value,
    onChange,
}: PropsWithChildren<Props>) => {
    return (
        <Card className={className}>
            <CardHeader>{children}</CardHeader>
            <CardContent>
                <RadioGroup
                    value={value}
                    onValueChange={onChange}
                    className="space-y-3"
                >
                    {answerTypes.map((answerType) => {
                        const config = configs[answerType];
                        return (
                            <div
                                key={answerType}
                                className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                    value === answerType
                                        ? config.bgColor
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <RadioGroupItem
                                    value={answerType}
                                    id={answerType}
                                    className={config.textColor}
                                />
                                <Label
                                    htmlFor={answerType}
                                    className="flex-1 cursor-pointer flex items-center gap-3"
                                >
                                    <config.icon
                                        className={`size-4 ${configs[answerType].textColor}`}
                                    />
                                    <span className="capitalize font-medium text-gray-900">
                                        {answerType}
                                    </span>
                                </Label>
                            </div>
                        );
                    })}
                </RadioGroup>
            </CardContent>
        </Card>
    );
};
