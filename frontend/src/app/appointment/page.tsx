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
    Clock,
    CheckCircle,
    Activity,
} from 'lucide-react';
import { Stats, StatsGrid, Props as StatsProps } from '@/components/stats';
import { toast } from 'sonner';
import { Appointment, Status, statuses } from '@/lib/api/dto/appointment';
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

const getStats = (appointments: Appointment[]): StatsProps[] => {
    return [
        {
            label: 'Total Appointments',
            value: appointments.length.toString(),
            icon: Calendar,
            description: 'All appointments',
            color: 'blue',
        },
        {
            label: 'Approved',
            value: appointments
                .filter((apt) => apt.status === 'approved')
                .length.toString(),
            icon: CheckCircle,
            description: 'Ready to donate',
            color: 'emerald',
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
            color: 'amber',
        },
        {
            label: 'Completed',
            value: appointments
                .filter((apt) => apt.status === 'done')
                .length.toString(),
            icon: Activity,
            description: 'Successfully done',
            color: 'purple',
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
                {stats!.map((entry, index) => (
                    <Stats key={index} {...entry} />
                ))}
            </StatsGrid>
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

                    <CardGrid>
                        {filteredAppointments!.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                {...appointment}
                            />
                        ))}
                    </CardGrid>
                </div>
            </div>
        </div>
    );
}
