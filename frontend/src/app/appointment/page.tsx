'use client';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Search,
    Filter,
    Calendar,
    Users,
    Clock,
    User,
    CheckCircle,
    Activity,
    XCircle,
    MapPin,
    Timer,
    QrCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Stats, Props as StatsProps } from '@/components/stats';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Appointment, Status, statuses } from '@/lib/api/dto/appointment';
import { useCurrentAccountAppointment } from '@/hooks/appointment/useCurrentAccountAppointment';
import { redirect } from 'next/navigation';
import { useMemo, useState } from 'react';
import { capitalCase } from 'change-case';

const statusConfig = {
    on_process: {
        color: 'bg-amber-500',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-700',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        ringColor: 'ring-amber-500/20',
        icon: Clock,
        label: 'Processing',
        description: 'Under review',
    },
    approved: {
        color: 'bg-emerald-500',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-700',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        ringColor: 'ring-emerald-500/20',
        icon: CheckCircle,
        label: 'Approved',
        description: 'Ready to donate',
    },
    checked_in: {
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-700',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        ringColor: 'ring-blue-500/20',
        icon: Users,
        label: 'Checked In',
        description: 'Currently active',
    },
    done: {
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-700',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        ringColor: 'ring-purple-500/20',
        icon: Activity,
        label: 'Completed',
        description: 'Successfully done',
    },
    rejected: {
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-700',
        badgeColor: 'bg-red-100 text-red-800 border-red-200',
        ringColor: 'ring-red-500/20',
        icon: XCircle,
        label: 'Rejected',
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

const AppointmentCard = (appointment: Appointment) => {
    const config = statusConfig[appointment.status];
    const Icon = config.icon;
    const timeDisplay = getTimeDisplay(
        appointment.start_time,
        appointment.end_time,
    );

    return (
        <Card
            key={appointment.id}
            className={`group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-slate-200 rounded-2xl overflow-hidden`}
        >
            <CardHeader>
                <CardTitle>
                    <div className="flex items-start gap-4 flex-1">
                        <div
                            className={`p-3 rounded-xl ${config.color} ${config.ringColor} shadow-lg ring-4 ring-opacity-20`}
                        >
                            <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                    {appointment.title}
                                </h3>
                                <Badge
                                    className={`${config.badgeColor} border text-xs font-semibold px-2 py-1`}
                                >
                                    {config.label}
                                </Badge>
                            </div>
                            <div className="flex flex-col gap-4 text-sm text-slate-600 mb-3">
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>ID: {appointment.id}</span>
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
                                        {new Date(
                                            appointment.start_time,
                                        ).toLocaleDateString()}{' '}
                                        at{' '}
                                        {new Date(
                                            appointment.start_time,
                                        ).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">End:</span>
                                    <span className="font-medium text-slate-900">
                                        {new Date(
                                            appointment.end_time,
                                        ).toLocaleDateString()}{' '}
                                        at{' '}
                                        {new Date(
                                            appointment.end_time,
                                        ).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
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

const getStats = (appointments: Appointment[]): StatsProps[] => {
    return [
        {
            label: 'Total Appointments',
            value: appointments.length.toString(),
            icon: Calendar,
            description: 'All appointments',
            fg: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Approved',
            value: appointments
                .filter((apt) => apt.status === 'approved')
                .length.toString(),
            icon: CheckCircle,
            description: 'Ready to donate',
            fg: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            label: 'In Progress',
            value: appointments
                .filter(
                    (apt) =>
                        apt.status === 'on_process' ||
                        apt.status === 'checked_in',
                )
                .length.toString(),
            icon: Clock,
            description: 'Pending & active',
            fg: 'text-amber-600',
            bg: 'bg-amber-50',
        },
        {
            label: 'Completed',
            value: appointments
                .filter((apt) => apt.status === 'done')
                .length.toString(),
            icon: Activity,
            description: 'Successfully done',
            fg: 'text-purple-600',
            bg: 'bg-purple-50',
        },
    ];
};

export default function AppointmentPage() {
    const {
        data: appointments,
        isPending,
        error,
    } = useCurrentAccountAppointment();
    const stats = useMemo(
        () => (appointments ? getStats(appointments) : undefined),
        [appointments],
    );
    const [status, setStatus] = useState<Status>('approved');
    const [search, setSearch] = useState<string | undefined>();
    const filteredAppointments = useMemo(
        () =>
            appointments
                ?.filter((appointment) => appointment.status === status)
                .filter(
                    (appointment) =>
                        !search || appointment.title.includes(search),
                ),
        [appointments, status, search],
    );

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error('Login to use this feature');
        redirect('/auth/login');
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
                            <Calendar className="h-4 w-4 mr-2" />
                            Appointment Management
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                            Your Blood Donation
                            <span className="block text-blue-600">
                                Appointments
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                            Manage and track your donation appointments
                        </p>
                    </div>
                </div>
            </section>
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats!.map((entry, index) => (
                            <Stats key={index} {...entry} />
                        ))}
                    </div>
                </div>
            </section>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12">
                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search appointments..."
                                className="pl-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 rounded-xl"
                            />
                        </div>
                        <Select
                            value={status}
                            onValueChange={(value: Status) => setStatus(value)}
                        >
                            <SelectTrigger
                                value={status}
                                className="w-fit border-slate-200"
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {capitalCase(status)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        {filteredAppointments!.map((appointment) => (
                            <AppointmentCard key={appointment.id} {...appointment} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
