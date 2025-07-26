import { Appointment } from '@/lib/api/dto/appointment';
import { formatDistanceToNow } from 'date-fns';
import {
    Activity,
    CheckCircle,
    Clock,
    MapPin,
    QrCode,
    Timer,
    User,
    Users,
    XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBloodRequest } from '@/hooks/use-blood-request';
import { toast } from 'sonner';

const statusConfig = {
    on_process: {
        color: 'bg-amber-500',
        ringColor: 'ring-amber-500/20',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock,
        description: 'Under review',
    },
    approved: {
        color: 'bg-emerald-500',
        ringColor: 'ring-emerald-500/20',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle,
        description: 'Ready to donate',
    },
    checked_in: {
        color: 'bg-blue-500',
        ringColor: 'ring-blue-500/20',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Users,
        description: 'Currently active',
    },
    donated: {
        color: 'bg-purple-500',
        ringColor: 'ring-purple-500/20',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: Activity,
        description: 'Donated',
    },
    done: {
        color: 'bg-green-500',
        ringColor: 'ring-green-500/20',
        badgeColor: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        description: 'Successfully done',
    },
    rejected: {
        color: 'bg-red-500',
        ringColor: 'ring-red-500/20',
        badgeColor: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        description: 'Not approved',
    },
};

const getTimeDisplay = (startTime: Date, endTime: Date): string => {
    const now = new Date();
    if (startTime > now) {
        return `In ${formatDistanceToNow(startTime)}`;
    } else if (endTime > now) {
        return 'Active now';
    } else {
        return `${formatDistanceToNow(endTime)} ago`;
    }
};

export const AppointmentCard = ({
    appointment,
    onDisplayQR,
}: {
    appointment: Appointment;
    onDisplayQR: () => void;
}) => {
    const {
        data: request,
        isPending,
        error,
    } = useBloodRequest(appointment.request_id);

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error(error.message);
        return <div></div>;
    }

    const config = statusConfig[appointment.status];
    const timeDisplay = getTimeDisplay(request.start_time, request.end_time);

    return (
        <Card className="group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-slate-200 rounded-2xl overflow-hidden">
            <CardHeader>
                <CardTitle>
                    <div className="flex items-start gap-4 flex-1">
                        <div
                            className={`p-3 rounded-xl ${config.color} ${config.ringColor} shadow-lg ring-4 ring-opacity-20`}
                        >
                            <config.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                    {request.title}
                                </h3>
                                <Badge
                                    className={`${config.badgeColor} border text-xs font-semibold px-2 py-1`}
                                >
                                    {config.description}
                                </Badge>
                            </div>
                            <div className="flex flex-col gap-4 text-sm text-slate-600 mb-3">
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>Id: {appointment.id}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>
                                        Request: {appointment.request_id}
                                    </span>
                                </div>
                                {appointment.reason && (
                                    <div className="flex items-start gap-1">
                                        <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                        <span>
                                            <span className="font-medium text-slate-800">
                                                Reason:
                                            </span>{' '}
                                            {appointment.reason}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-6">
                    <div>
                        <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-2 text-slate-700">
                                <Timer className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                    {timeDisplay}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        Start:
                                    </span>
                                    <span className="font-medium text-slate-900">
                                        {formatDateTime(
                                            new Date(request.start_time),
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">End:</span>
                                    <span className="font-medium text-slate-900">
                                        {formatDateTime(
                                            new Date(request.end_time),
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(appointment.status === 'approved' ||
                        appointment.status === 'checked_in') && (
                            <div className="space-y-2">
                                <Button
                                    onClick={onDisplayQR}
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-slate-200 hover:bg-slate-50 rounded"
                                >
                                    <QrCode className="h-4 w-4 mr-2" />
                                    Show QR Code
                                </Button>
                            </div>
                        )}
                </div>
            </CardContent>
        </Card>
    );
};
