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
    Search,
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
import { Input } from '@/components/ui/input';
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { deserialize, fetchWrapper } from '@/lib/api';
import { Account } from '@/lib/api/dto/account';
import { columns } from './column';

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

export default function AppointmentManagementPage() {
    const { data: appointments, isPending, error } = useAppointmentList();
    const stats = useMemo(
        () => (appointments ? getStats(appointments) : undefined),
        [appointments],
    );
    const [search, setSearch] = useState<string | undefined>();
    const [selectedStatus, setSelectedStatus] = useState<Status | 'all'>('all');
    const filteredAppointments = useMemo(() => {
        if (!appointments) return [];

        return appointments
            .filter((apt) => apt.status !== 'done' && apt.status !== 'rejected')
            .filter(
                (apt) =>
                    selectedStatus === 'all' || apt.status === selectedStatus,
            )
            .filter(async (apt) => {
                if (!search) return true;

                const searchTerm = search.toLowerCase().trim();
                const response = await fetchWrapper(`/account/${apt.donor_id}`);
                const donor: Account = await deserialize(response);

                return (
                    donor.name.toLowerCase().includes(searchTerm) ||
                    donor.email.toLowerCase().includes(searchTerm)
                );
            });
    }, [appointments, selectedStatus, search]);

    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 10,
    });
    const pageCount = Math.ceil(
        filteredAppointments.length || 0 / pagination.pageSize,
    );
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const table = useReactTable({
        data: filteredAppointments,
        columns: columns,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnVisibility,
        },
    });

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
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="p-4 pl-11 border-slate-200 focus:border-rose-300 focus:ring-rose-200"
                        />
                    </div>
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
                            {statuses
                                .filter(
                                    (status) =>
                                        status !== 'rejected' &&
                                        status !== 'done',
                                )
                                .map((status) => (
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
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
