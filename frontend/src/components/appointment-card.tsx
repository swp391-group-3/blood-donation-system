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
import { capitalCase } from 'change-case';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const statusConfig = {
    on_process: {
        color: 'amber',
        icon: Clock,
    },
    approved: {
        color: 'emerald',
        icon: CheckCircle,
    },
    checked_in: {
        color: 'blue',
        icon: Users,
    },
    done: {
        color: 'purple',
        icon: Activity,
    },
    rejected: {
        color: 'red',
        icon: XCircle,
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

export const AppointmentCard = (appointment: Appointment) => {
    const config = statusConfig[appointment.status];
    const timeDisplay = getTimeDisplay(
        appointment.start_time,
        appointment.end_time,
    );

    return (
        <Card
            key={appointment.id}
            className="group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-slate-200 rounded-2xl overflow-hidden"
        >
            <CardHeader>
                <CardTitle>
                    <div className="flex items-start gap-4 flex-1">
                        <div
                            className={`p-3 rounded-xl bg-${config.color}-500 ring-${config.color}-500/20 shadow-lg ring-4 ring-opacity-20`}
                        >
                            <config.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                    {appointment.title}
                                </h3>
                                <Badge
                                    className={`bg-${config.color}-100 text-${config.color}-800 border-${config.color}-200 border text-xs font-semibold px-2 py-1`}
                                >
                                    {capitalCase(appointment.status)}
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
                                            new Date(appointment.start_time),
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">End:</span>
                                    <span className="font-medium text-slate-900">
                                        {formatDateTime(
                                            new Date(appointment.end_time),
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-slate-200 hover:bg-slate-50 rounded"
                        >
                            <QrCode className="h-4 w-4 mr-2" />
                            Show QR Code
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
