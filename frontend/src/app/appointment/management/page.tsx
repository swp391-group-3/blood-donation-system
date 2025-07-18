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
    Search,
} from 'lucide-react';
import { Stats, StatsGrid, Props as StatsProps } from '@/components/stats';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { capitalCase } from 'change-case';
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginationRange } from '@/components/pagination-range';

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

    // TODO: check pagination to see if it work
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const table = useReactTable({
        data: filteredAppointments,
        columns: columns,
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
                <Pagination className="m-8">
                    <PaginationContent>
                        {/* PREVIOUS */}
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.previousPage();
                                }}
                                aria-disabled={!table.getCanPreviousPage()}
                                tabIndex={
                                    !table.getCanPreviousPage() ? -1 : undefined
                                }
                                className={
                                    !table.getCanPreviousPage()
                                        ? 'pointer-events-none opacity-50'
                                        : undefined
                                }
                            />
                        </PaginationItem>
                        {/* PAGE NUMBERS */}
                        <PaginationRange
                            pageIndex={table.getState().pagination.pageIndex}
                            pageCount={table.getPageCount()}
                            onPageChange={table.setPageIndex}
                        />
                        {/* NEXT */}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.nextPage();
                                }}
                                aria-disabled={!table.getCanNextPage()}
                                tabIndex={
                                    !table.getCanNextPage() ? -1 : undefined
                                }
                                className={
                                    !table.getCanNextPage()
                                        ? 'pointer-events-none opacity-50'
                                        : undefined
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
