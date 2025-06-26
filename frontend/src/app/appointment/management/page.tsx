'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Filter,
    Droplets,
    Clock,
    CheckCircle,
    XCircle,
    Calendar,
    LucideIcon,
    Stethoscope,
    Eye,
    AlertTriangle,
    PlusSquare,
} from 'lucide-react';
import { Stats, StatsGrid, Props as StatsProps } from '@/components/stats';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { capitalCase } from 'change-case';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { Hero, HeroDescription, HeroTitle } from '@/components/hero';
import { Appointment, Status, statuses } from '@/lib/api/dto/appointment';
import { useAppointmentList } from '@/hooks/use-appointment-list';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AccountPicture } from '@/components/account-picture';
import { Badge } from '@/components/ui/badge';
import { ReviewDialog } from '@/components/review-dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAppointment } from '@/hooks/use-appointent';

const getStats = (appointments: Appointment[]): StatsProps[] => {
    return [
        {
            label: 'Need Review',
            value: appointments.filter((apt) => apt.status === 'on_process')
                .length,
            icon: Clock,
            description: 'Requires staff attention',
            color: 'yellow',
        },
        {
            label: 'Approved',
            value: appointments.filter((apt) => apt.status === 'approved')
                .length,
            icon: CheckCircle,
            description: 'Ready for health check',
            color: 'green',
        },
        {
            label: 'Completed',
            value: appointments.filter((apt) => apt.status === 'done').length,
            icon: Droplets,
            description: 'Donation that has been completed',
            color: 'blue',
        },
        {
            label: 'Rejected',
            value: appointments.filter((apt) => apt.status === 'rejected')
                .length,
            icon: XCircle,
            description: 'Did not meet criteria',
            color: 'red',
        },
    ];
};

const statusConfigs: Record<Status, { color: string; icon: LucideIcon }> = {
    on_process: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
    },
    approved: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
    },
    checked_in: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Stethoscope,
    },
    donated: {
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle,
    },
    done: {
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle,
    },
    rejected: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
    },
};

const priorityConfigs = {
    high: {
        color: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: AlertTriangle,
    },
    medium: {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock,
    },
    low: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Calendar,
    },
};

const AppointmentRow = ({ id }: { id: string }) => {
    const { data: apt, isPending, error } = useAppointment(id);

    if (isPending) {
        return <TableRow />;
    }

    if (error) {
        toast.error(error.message);
        return <TableRow />;
    }

    const statusConfig = statusConfigs[apt.status];
    const priorityConfig = priorityConfigs[apt.request.priority];

    return (
        <TableRow>
            <TableCell className="p-6">
                <div className="flex items-center gap-4">
                    <div className="size-10">
                        <AccountPicture name={apt.member.name} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-900 truncate">
                            {apt.member.name}
                        </div>
                        <div className="text-sm text-slate-600 truncate">
                            {apt.member.email}
                        </div>
                    </div>
                </div>
            </TableCell>
            <TableCell className="p-6">
                <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-red-600">
                        {bloodGroupLabels[apt.member.blood_group]}
                    </span>
                </div>
            </TableCell>
            <TableCell className="p-6">
                <Badge
                    className={`text-md px-3 py-1 font-semibold ${priorityConfig!.color}`}
                >
                    {priorityConfig && (
                        <priorityConfig.icon className="size-8" />
                    )}
                    <span className="ml-2">
                        {capitalCase(apt.request.priority)}
                    </span>
                </Badge>
            </TableCell>
            <TableCell className="p-6">
                <Badge
                    className={`text-md px-3 py-1 font-semibold ${statusConfig.color}`}
                >
                    <statusConfig.icon className="size-8" />
                    <span className="ml-2">{capitalCase(apt.status)}</span>
                </Badge>
            </TableCell>
            <TableCell className="p-6">
                {apt.status === 'on_process' && (
                    <ReviewDialog appointmentId={id}>
                        <Button
                            size="sm"
                            className="bg-lime-600 hover:bg-lime-700 text-white rounded-lg"
                        >
                            <Eye className="h-3 w-3 mr-1" />
                            Review
                        </Button>
                    </ReviewDialog>
                )}

                {apt.status === 'approved' && (
                    <Link href={`/appointment/management/${id}/health`}>
                        <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            <Stethoscope className="h-3 w-3 mr-1" />
                            Health Check
                        </Button>
                    </Link>
                )}

                {apt.status === 'checked_in' && (
                    <Link href={`/appointment/management/${id}/health`}>
                        <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                        >
                            <Droplets className="h-3 w-3 mr-1" />
                            Donation
                        </Button>
                    </Link>
                )}

                {apt.status === 'donated' && (
                    <Link href={`/appointment/management/${id}/donate`}>
                        <Button
                            size="sm"
                            className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 rounded-lg"
                        >
                            <PlusSquare className="h-3 w-3 mr-1" />
                            Add Blood Bags
                        </Button>
                    </Link>
                )}
            </TableCell>
        </TableRow>
    );
};

export default function AppointmentManagementPage() {
    const { data: appointments, isPending, error } = useAppointmentList();
    const stats = useMemo(
        () => (appointments ? getStats(appointments) : undefined),
        [appointments],
    );
    const [selectedStatus, setSelectedStatus] = useState<Status | 'all'>('all');
    const filtered = useMemo(() => {
        return (
            appointments?.filter(
                (apt) =>
                    selectedStatus === 'all' || apt.status === selectedStatus,
            ) ?? []
        );
    }, [appointments, selectedStatus]);

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error('Failed to fetch blood request list');
        return <div></div>;
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            <Hero>
                <HeroTitle>Manage Appointments</HeroTitle>
                <HeroDescription>
                    Review donor appointments and manage donation flow
                </HeroDescription>
            </Hero>

            <StatsGrid>
                {stats!.map((entry, index) => (
                    <Stats key={index} {...entry} />
                ))}
            </StatsGrid>

            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                    <div className="relative flex-1"></div>
                    <Select
                        value={selectedStatus}
                        onValueChange={(value: Status | 'all') =>
                            setSelectedStatus(value)
                        }
                    >
                        <SelectTrigger className="w-fit border-slate-200">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem key="all" value="all">
                                All
                            </SelectItem>
                            {statuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {capitalCase(status)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="p-6 font-semibold text-slate-900">
                                    Member
                                </TableHead>
                                <TableHead className="p-6 font-semibold text-slate-900">
                                    Blood Type
                                </TableHead>
                                <TableHead className="p-6 font-semibold text-slate-900">
                                    Priority
                                </TableHead>
                                <TableHead className="p-6 font-semibold text-slate-900">
                                    Status
                                </TableHead>
                                <TableHead className="p-6 font-semibold text-slate-900">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <div className="text-center py-12">
                                            <Calendar className="size-16 text-slate-400 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                                No appointments found
                                            </h3>
                                            <p className="text-slate-600">
                                                No appointments match your
                                                current filters.
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((apt) => (
                                    <AppointmentRow key={apt.id} id={apt.id} />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
