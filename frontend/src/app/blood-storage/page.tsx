'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    Hero,
    HeroDescription,
    HeroKeyword,
    HeroTitle,
} from '@/components/hero';
import {
    BloodBag,
    BloodComponent,
    bloodComponents,
} from '@/lib/api/dto/blood-bag';
import {
    Blend,
    Check,
    CircleX,
    Droplet,
    Filter,
    Package,
    Plus,
    TriangleAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { capitalCase } from 'change-case';
import {
    bloodGroupLabels,
    bloodGroups,
    BloodGroup,
} from '@/lib/api/dto/blood-group';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteBloodBag } from '@/hooks/use-delete-blood-bag';
import RequestBloodDialog from '@/components/request-blood-form';
import { EmptyState } from '@/components/ui/empty-state';
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { getColumns } from './column';
import { Mode, modes, useAllBloodBag } from '@/hooks/use-all-blood-bag';
import { PaginationControl } from '@/components/pagination-control';
import { useBloodBagStats } from '@/hooks/use-blood-bag-stats';
import {
    Stats,
    StatsDescription,
    StatsGrid,
    StatsIcon,
    StatsLabel,
    StatsValue,
} from '@/components/stats';

export default function BloodStorage() {
    const [selectedBag, setSelectedBag] = useState<BloodBag | null>(null);
    const [showUseDialog, setShowUseDialog] = useState(false);
    const [component, setComponent] = useState<BloodComponent | 'all'>('all');
    const [bloodGroup, setBloodGroup] = useState<BloodGroup | 'all'>('all');
    const [mode, setMode] = useState<Mode>('Compatible');
    const [openRequestDialog, setOpenRequestDialog] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { mutate: deleteBloodBag, isPending: isDeleting } =
        useDeleteBloodBag();

    const {
        data: bloodBags,
        isPending,
        error,
    } = useAllBloodBag({
        blood_group: bloodGroup === 'all' ? undefined : bloodGroup,
        component: component === 'all' ? undefined : component,
        mode,
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
    });
    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            pageIndex: 0,
        }));
    }, [bloodGroup, component, mode]);

    const { data: stats } = useBloodBagStats();

    const columns = useMemo(
        () =>
            getColumns((bag) => {
                setSelectedBag(bag);
                setShowUseDialog(true);
            }),
        [],
    );

    const table = useReactTable({
        data: bloodBags?.data || [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        manualPagination: true,
        rowCount: bloodBags?.element_count ?? 0,
        initialState: {
            pagination,
        },
    });

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error('Fail to fetch blood storage data');
        return <div></div>;
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            <Hero>
                <HeroTitle>
                    Blood Inventory
                    <HeroKeyword color="rose">Requests</HeroKeyword>
                </HeroTitle>
                <HeroDescription>
                    Monitor blood bag inventory and ensure optimal supply
                    management
                </HeroDescription>
            </Hero>

            {stats && (
                <StatsGrid>
                    <Stats>
                        <StatsIcon className="bg-blue-50 text-blue-600">
                            <Package />
                        </StatsIcon>
                        <StatsValue>{stats.total_bags}</StatsValue>
                        <StatsLabel>Total Bags</StatsLabel>
                        <StatsDescription>Complete inventory</StatsDescription>
                    </Stats>
                    <Stats>
                        <StatsIcon className="bg-green-50 text-green-600">
                            <Check />
                        </StatsIcon>
                        <StatsValue>{stats.available_bags}</StatsValue>
                        <StatsLabel>Available</StatsLabel>
                        <StatsDescription>Ready for use</StatsDescription>
                    </Stats>
                    <Stats>
                        <StatsIcon className="bg-yellow-50 text-yellow-600">
                            <TriangleAlert />
                        </StatsIcon>
                        <StatsValue>{stats.expiring_bags}</StatsValue>
                        <StatsLabel>Expiring Soon</StatsLabel>
                        <StatsDescription>Within 7 days</StatsDescription>
                    </Stats>
                    <Stats>
                        <StatsIcon className="bg-rose-50 text-rose-600">
                            <CircleX />
                        </StatsIcon>
                        <StatsValue>{stats.expired_bags}</StatsValue>
                        <StatsLabel>Expired</StatsLabel>
                        <StatsDescription>Requires disposal</StatsDescription>
                    </Stats>
                </StatsGrid>
            )}

            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col justify-between sm:flex-row gap-4 mb-10">
                    <Button
                        className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25 font-medium rounded-xl"
                        onClick={() => setOpenRequestDialog(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Blood Request
                    </Button>
                    <div className="flex gap-3">
                        <Select
                            value={component}
                            onValueChange={(value: BloodComponent | 'all') =>
                                setComponent(value)
                            }
                        >
                            <SelectTrigger
                                onReset={() => setComponent('all')}
                                className="w-fit border-slate-200"
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Component" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {bloodComponents.map((component) => (
                                    <SelectItem
                                        key={component}
                                        value={component}
                                    >
                                        {capitalCase(component)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={bloodGroup}
                            onValueChange={(value: BloodGroup | 'all') =>
                                setBloodGroup(value)
                            }
                        >
                            <SelectTrigger className="w-fit border-slate-200">
                                <Droplet className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Blood Group" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {bloodGroups.map((group) => (
                                    <SelectItem key={group} value={group}>
                                        {bloodGroupLabels[group]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={mode}
                            onValueChange={(value: Mode) => setMode(value)}
                            defaultValue={'Compatible'}
                        >
                            <SelectTrigger className="w-fit border-slate-200">
                                <Blend className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                {modes.map((mode) => (
                                    <SelectItem key={mode} value={mode}>
                                        {capitalCase(mode)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-md border">
                    {!bloodBags || bloodBags.data.length === 0 ? (
                        <EmptyState
                            className="mx-auto"
                            title="No blood bags found"
                            description="Create new blood donation to get desired blood bags"
                            icons={[Package]}
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

                <Dialog open={showUseDialog} onOpenChange={setShowUseDialog}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-900">
                                Remove Blood Bag
                            </DialogTitle>
                            <DialogDescription className="text-slate-600">
                                Are you sure want to remove this blood bag?
                            </DialogDescription>
                        </DialogHeader>
                        {selectedBag && (
                            <div className="py-4 space-y-4">
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                                            <Droplet className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900">
                                                Blood Bag Details
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                ID: {selectedBag.id}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-slate-500">
                                                Component:
                                            </span>
                                            <div className="font-medium text-slate-900">
                                                {capitalCase(
                                                    selectedBag.component,
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">
                                                Amount:
                                            </span>
                                            <div className="font-medium text-slate-900">
                                                {selectedBag.amount} ml
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-slate-500">
                                                Expiry Date:
                                            </span>
                                            <div className="font-medium text-slate-900">
                                                {formatDateTime(
                                                    new Date(
                                                        selectedBag.expired_time,
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowUseDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    if (selectedBag) {
                                        deleteBloodBag(selectedBag.id);
                                        setShowUseDialog(false);
                                    }
                                }}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Remove
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <RequestBloodDialog
                open={openRequestDialog}
                onOpenChange={setOpenRequestDialog}
            />
        </div>
    );
}
