import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PropsWithChildren } from 'react';
import { Appointment } from '@/lib/api/dto/appointment';
import { toast } from 'sonner';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { Account } from '@/lib/api/dto/account';
import { useApppointmentAnswer } from '@/hooks/use-apppointment-answer';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useApproveAppointment } from '@/hooks/use-approve-appointment';
import { useRejectAppointment } from '@/hooks/use-reject-appointment';

const getAnswerIcon = (answer: string) => {
    switch (answer) {
        case 'yes':
            return <CheckCircle className="h-4 w-4 text-green-600" />;
        case 'no':
            return <XCircle className="h-4 w-4 text-red-600" />;
        case 'unsure':
            return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
        default:
            return null;
    }
};

export const ReviewDialog = ({
    children,
    account,
    appointment,
}: PropsWithChildren<{ account: Account; appointment: Appointment }>) => {
    const {
        data: answers,
        isPending,
        error,
    } = useApppointmentAnswer(appointment.id);

    const approve = useApproveAppointment(appointment.id);
    const reject = useRejectAppointment(appointment.id);

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error(error.message);
        return <div></div>;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900">
                        Application Review - {account.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Applicant Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-slate-500">
                                    Name:
                                </span>
                                <div className="font-semibold text-slate-900">
                                    {account.name}
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-slate-500">
                                    Blood Group:
                                </span>
                                <div className="font-semibold text-red-600">
                                    {bloodGroupLabels[account.blood_group]}
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-slate-500">
                                    Email:
                                </span>
                                <div className="font-semibold text-slate-900">
                                    {account.email}
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-slate-500">
                                    Phone:
                                </span>
                                <div className="font-semibold text-slate-900">
                                    {account.phone}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Screening Questionnaire
                        </h3>
                        <div className="space-y-4">
                            {answers.map((answer, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg"
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            {getAnswerIcon(answer.answer)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900 mb-1">
                                                Q{index}: {answer.question}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    className={`capitalize text-xs ${
                                                        answer.answer === 'yes'
                                                            ? 'bg-green-100 text-green-800'
                                                            : answer.answer ===
                                                                'no'
                                                              ? 'bg-red-100 text-red-800'
                                                              : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {answer.answer}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-slate-200">
                        <Button
                            disabled={approve.isPending || reject.isPending}
                            onClick={() => {
                                approve.mutate();
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl"
                        >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Approve
                        </Button>
                        <Button
                            disabled={approve.isPending || reject.isPending}
                            onClick={() => {
                                reject.mutate();
                            }}
                            variant="outline"
                            className="flex-1 border-red-200 text-red-700 hover:bg-red-50 h-12 rounded-xl"
                        >
                            <XCircle className="h-5 w-5 mr-2" />
                            Reject
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
