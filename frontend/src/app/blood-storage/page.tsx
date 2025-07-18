'use client';

import { useMemo, useState } from 'react';
import {
    Hero,
    HeroDescription,
    HeroKeyword,
    HeroTitle,
} from '@/components/hero';
import { StatsGrid, Stats, Props as StatsProps } from '@/components/stats';
import {
    BloodBag,
    BloodComponent,
    bloodComponents,
} from '@/lib/api/dto/blood-bag';
import {
    Activity,
    AlertTriangle,
    Blend,
    Calendar,
    Check,
    CircleX,
    Droplet,
    Droplets,
    Filter,
    Package,
    Plus,
    TriangleAlert,
    XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Mode,
    modes,
    useBloodStorageList,
} from '@/hooks/use-blood-storage-list';
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
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/utils';
import { differenceInCalendarWeeks } from 'date-fns';
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

const getStats = (bloodBags: BloodBag[]): StatsProps[] => {
    return [
        {
            label: 'Total Bags',
            value: bloodBags.length,
            icon: Package,
            description: 'Complete Inventory',
            color: 'blue',
        },
        {
            label: 'Available',
            value: bloodBags.filter((bag) => !bag.is_used).length,
            icon: Check,
            description: 'Ready for use',
            color: 'green',
        },
        {
            label: 'Expiring Soon',
            value: bloodBags.filter(
                (bag) =>
                    !bag.is_used &&
                    !isExpired(new Date(bag.expired_time)) &&
                    isExpiringSoon(new Date(bag.expired_time)),
            ).length,
            icon: TriangleAlert,
            description: 'Within 7 days',
            color: 'yellow',
        },
        {
            label: 'Expired',
            value: bloodBags.filter(
                (bag) => !bag.is_used && !isExpired(new Date(bag.expired_time)),
            ).length,
            icon: CircleX,
            description: 'Requires disposal',
            color: 'rose',
        },
    ];
};

const componentColors: Record<BloodComponent, string> = {
    plasma: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    red_cell: 'bg-red-100 text-red-800 border-red-200',
    platelet: 'bg-blue-100 text-blue-800 border-blue-200',
};

const bloodGroupColors: Record<BloodGroup, string> = {
    o_plus: 'bg-red-100 text-red-800 border-red-200',
    o_minus: 'bg-red-200 text-red-900 border-red-300',
    a_plus: 'bg-blue-100 text-blue-800 border-blue-200',
    a_minus: 'bg-blue-200 text-blue-900 border-blue-300',
    b_plus: 'bg-green-100 text-green-800 border-green-200',
    b_minus: 'bg-green-200 text-green-900 border-green-300',
    a_b_plus: 'bg-purple-100 text-purple-800 border-purple-200',
    a_b_minus: 'bg-purple-200 text-purple-900 border-purple-300',
};

const isExpired = (date: Date) => new Date(date) <= new Date();

const isExpiringSoon = (date: Date) =>
    differenceInCalendarWeeks(new Date(), new Date(date)) <= 1;

export default function BloodStorage() {
    const [selectedBag, setSelectedBag] = useState<BloodBag | null>(null);
    const [showUseDialog, setShowUseDialog] = useState(false);
    const [component, setComponent] = useState<BloodComponent | 'all'>('all');
    const [bloodGroup, setBloodGroup] = useState<BloodGroup | 'all'>('all');
    const [mode, setMode] = useState<Mode>('Compatible');
    const [openRequestDialog, setOpenRequestDialog] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 10,
    });

    const { mutate: deleteBloodBag, isPending: isDeleting } =
        useDeleteBloodBag();

    const {
        data: bloodBags,
        isPending,
        error,
    } = useBloodStorageList({
        blood_group: bloodGroup === 'all' ? undefined : bloodGroup,
        component: component === 'all' ? undefined : component,
        mode,
    });

    const stats = useMemo(
        () => (bloodBags ? getStats(bloodBags) : undefined),
        [bloodBags],
    );
    const columns = useMemo(
        () =>
            getColumns((bag) => {
                setSelectedBag(bag);
                setShowUseDialog(true);
            }),
        [],
    );

    const pageCount = Math.ceil(bloodBags?.length || 0 / pagination.pageSize);

    const table = useReactTable({
        data: bloodBags || [],
        columns,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
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

            <StatsGrid>
                {stats!.map((entry, index) => (
                    <Stats key={index} {...entry} />
                ))}
            </StatsGrid>

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
                    {!bloodBags || bloodBags.length === 0 ? (
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

                            <div className="flex justify-between items-center mt-4 px-4 pb-2">
                                <div className="text-sm text-slate-600">
                                    Page {pagination.pageIndex + 1} of{' '}
                                    {pageCount}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.pageIndex === 0}
                                        onClick={() =>
                                            setPagination((prev) => ({
                                                ...prev,
                                                pageIndex: prev.pageIndex - 1,
                                            }))
                                        }
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            pagination.pageIndex + 1 >=
                                            pageCount
                                        }
                                        onClick={() =>
                                            setPagination((prev) => ({
                                                ...prev,
                                                pageIndex: prev.pageIndex + 1,
                                            }))
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <Dialog open={showUseDialog} onOpenChange={setShowUseDialog}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-900">
                                Mark Blood Bag as Used
                            </DialogTitle>
                            <DialogDescription className="text-slate-600">
                                Are you sure want to make this blood bag as used
                                ?
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
                                Mark as used
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
