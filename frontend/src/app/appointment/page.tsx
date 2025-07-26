'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Filter, Calendar, CheckCircle, Clock, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { Status, statuses } from '@/lib/api/dto/appointment';
import { useCurrentAccountAppointment } from '@/hooks/use-current-account-appointment';
import { redirect } from 'next/navigation';
import { useMemo, useState } from 'react';
import { capitalCase } from 'change-case';
import {
    Hero,
    HeroDescription,
    HeroKeyword,
    HeroSummary,
    HeroTitle,
} from '@/components/hero';
import { CardGrid } from '@/components/card-grid';
import { AppointmentCard } from '@/components/appointment-card';
import { QRDialog } from '@/components/qr-dialog';
import {
    Stats,
    StatsDescription,
    StatsGrid,
    StatsIcon,
    StatsLabel,
    StatsValue,
} from '@/components/stats';

export default function AppointmentPage() {
    const {
        data: appointments,
        isPending,
        error,
    } = useCurrentAccountAppointment();

    const [status, setStatus] = useState<Status>('all');
    const filteredAppointments = useMemo(
        () => {
            if (status === "all") return appointments;
            return appointments?.filter(apt => apt.status === status);
        },
        [appointments, status],
    );
    const [selected, setSelected] = useState<string | undefined>();
    const url = useMemo(() => {
        if (!selected) return undefined;

        const appointment = appointments?.find((apt) => apt.id === selected);
        if (!appointment) return undefined;

        if (appointment.status === 'approved') {
            return `${window.location.href}/management/${selected}/health`;
        } else if (appointment.status === 'checked_in') {
            return `${window.location.href}/management/${selected}/donation`;
        }
    }, [selected, appointments]);

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error('Login to use this feature');
        redirect('/auth/login');
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            <Hero>
                <HeroSummary color="rose">
                    <Calendar className="h-4 w-4 mr-2" />
                    Appointment Management
                </HeroSummary>
                <HeroTitle>
                    Your Blood Donation
                    <HeroKeyword color="rose">Appointments</HeroKeyword>
                </HeroTitle>
                <HeroDescription>
                    Manage and track your donation appointments
                </HeroDescription>
            </Hero>

            <StatsGrid>
                <Stats>
                    <StatsIcon className="bg-blue-50 text-blue-600">
                        <Calendar />
                    </StatsIcon>
                    <StatsValue>{appointments.length}</StatsValue>
                    <StatsLabel>Total Appointments</StatsLabel>
                    <StatsDescription>All appointments</StatsDescription>
                </Stats>
                <Stats>
                    <StatsIcon className="bg-emerald-50 text-emerald-600">
                        <CheckCircle />
                    </StatsIcon>
                    <StatsValue>
                        {appointments
                            .filter((apt) => apt.status === 'approved')
                            .length.toString()}
                    </StatsValue>
                    <StatsLabel>Approved</StatsLabel>
                    <StatsDescription>Ready to donate</StatsDescription>
                </Stats>
                <Stats>
                    <StatsIcon className="bg-amber-50 text-amber-600">
                        <Clock />
                    </StatsIcon>
                    <StatsValue>
                        {
                            appointments.filter(
                                (apt) =>
                                    apt.status === 'on_process' ||
                                    apt.status === 'checked_in',
                            ).length
                        }
                    </StatsValue>
                    <StatsLabel>In Progress</StatsLabel>
                    <StatsDescription>Pending & active</StatsDescription>
                </Stats>
                <Stats>
                    <StatsIcon className="bg-purple-50 text-purple-600">
                        <Activity />
                    </StatsIcon>
                    <StatsValue>
                        {
                            appointments.filter((apt) => apt.status === 'done')
                                .length
                        }
                    </StatsValue>
                    <StatsLabel>Completed</StatsLabel>
                    <StatsDescription>Successfully done</StatsDescription>
                </Stats>
            </StatsGrid>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12">
                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <div className="relative flex-1"></div>
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
                                {statuses.map((status) => {
                                    console.log("status", status);

                                    return (
                                        <SelectItem key={status} value={status}>
                                            {capitalCase(status)}
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    <CardGrid>
                        {filteredAppointments!.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                onDisplayQR={() => setSelected(appointment.id)}
                            />
                        ))}
                    </CardGrid>

                    <QRDialog url={url} onReset={() => setSelected(undefined)}>
                        <p className="font-semibold text-slate-900 text-lg">
                            Check-in QR
                        </p>
                        <p className="text-xs text-slate-500">#{selected}</p>
                    </QRDialog>
                </div>
            </div>
        </div>
    );
}
