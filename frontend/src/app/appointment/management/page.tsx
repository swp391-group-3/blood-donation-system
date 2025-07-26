'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    CheckCircle,
    Clock,
    Droplets,
    FileText,
    Filter,
    Search,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { capitalCase } from 'change-case';
import { Hero, HeroDescription, HeroTitle } from '@/components/hero';
import { Status, statuses } from '@/lib/api/dto/appointment';
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
    PaginationState,
    useReactTable,
} from '@tanstack/react-table';
import { columns } from './column';
import { PaginationControl } from '@/components/pagination-control';
import { useAppointmentStats } from '@/hooks/use-appointment-stats';
import {
    Stats,
    StatsDescription,
    StatsGrid,
    StatsIcon,
    StatsLabel,
    StatsValue,
} from '@/components/stats';
import { EmptyState } from '@/components/ui/empty-state';

export default function AppointmentManagementPage() {
    const [search, setSearch] = useState<string | undefined>();
    const [selectedStatus, setSelectedStatus] = useState<Status | 'all'>('all');
    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 10,
        pageIndex: 0,
    });

    const { data: appointments } = useAppointmentList({
        query: search,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
    });
    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            pageIndex: 0,
        }));
    }, [search, selectedStatus]);

    const { data: stats } = useAppointmentStats();

    const table = useReactTable({
        data: appointments?.data ?? [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        manualPagination: true,
        rowCount: appointments?.element_count ?? 0,
        initialState: {
            pagination,
        },
    });

    return (
        <div className="flex-1 space-y-6 p-6">
            <Hero>
                <HeroTitle>Manage Appointments</HeroTitle>
                <HeroDescription>
                    Review donor appointments and manage donation flow
                </HeroDescription>
            </Hero>

            {stats && (
                <StatsGrid>
                    <Stats>
                        <StatsIcon className="bg-yellow-50 text-yellow-600">
                            <Clock />
                        </StatsIcon>
                        <StatsValue>{stats.on_process_appointments}</StatsValue>
                        <StatsLabel>Need Review</StatsLabel>
                        <StatsDescription>
                            Requires staff attention
                        </StatsDescription>
                    </Stats>
                    <Stats>
                        <StatsIcon className="bg-green-50 text-green-600">
                            <CheckCircle />
                        </StatsIcon>
                        <StatsValue>{stats.approved_appointments}</StatsValue>
                        <StatsLabel>Approved</StatsLabel>
                        <StatsDescription>
                            Ready for health check
                        </StatsDescription>
                    </Stats>
                    <Stats>
                        <StatsIcon className="bg-blue-50 text-blue-600">
                            <Droplets />
                        </StatsIcon>
                        <StatsValue>{stats.done_appointments}</StatsValue>
                        <StatsLabel>Completed</StatsLabel>
                        <StatsDescription>
                            Donation that has been completed
                        </StatsDescription>
                    </Stats>
                    <Stats>
                        <StatsIcon className="bg-rose-50 text-rose-600">
                            <XCircle />
                        </StatsIcon>
                        <StatsValue>{stats.rejected_appointments}</StatsValue>
                        <StatsLabel>Rejected</StatsLabel>
                        <StatsDescription>
                            Did not meet criteria
                        </StatsDescription>
                    </Stats>
                </StatsGrid>
            )}

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
                        onValueChange={(value: Status ) =>
                            setSelectedStatus(value)
                        }
                    >
                        <SelectTrigger className="w-fit border-slate-200">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
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
                    {!appointments || appointments.data.length === 0 ? (
                        <EmptyState
                            className="mx-auto"
                            title="No appointments found"
                            description="Correct your filter to see if there are appointments"
                            icons={[FileText]}
                        />
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => (
                                                        <TableHead
                                                            key={header.id}
                                                            className="text-center p-6 font-semibold text-slate-900"
                                                        >
                                                            {flexRender(
                                                                header.column
                                                                    .columnDef
                                                                    .header,
                                                                header.getContext(),
                                                            )}
                                                        </TableHead>
                                                    ),
                                                )}
                                            </TableRow>
                                        ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="p-6"
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>
                    )}
                </div>

                <PaginationControl
                    className="m-4"
                    itemCount={table.getRowCount()}
                    pagination={pagination}
                    setPagination={setPagination}
                />
            </div>
        </div>
    );
}
