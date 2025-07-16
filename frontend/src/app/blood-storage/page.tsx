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
import { Input } from '@/components/ui/input';

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

const normalizeBloodGroup = (raw: string): BloodGroup => {
    return raw
        .replace('plus', '+')
        .replace('minus', '-')
        .replace(/_/g, '')
        .toUpperCase() as BloodGroup;
};

export default function BloodStorage() {
    const [selectedBag, setSelectedBag] = useState<BloodBag | null>(null);
    const [showUseDialog, setShowUseDialog] = useState(false);
    const [component, setComponent] = useState<BloodComponent | 'all'>('all');
    const [bloodGroup, setBloodGroup] = useState<BloodGroup | 'all'>('all');
    const [mode, setMode] = useState<Mode>('Compatible');
    const [openRequestDialog, setOpenRequestDialog] = useState(false);

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
                        <Input
                            type="text"
                            placeholder="Search by name..."
                            className="w-64 border-slate-200"
                        />
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
                            value={component}
                            onValueChange={(value: Mode) => setMode(value)}
                            defaultValue={'Compatible'}
                        >
                            <SelectTrigger className="w-fit border-slate-200">
                                <Filter className="h-4 w-4 mr-2" />
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
                    <Table>
                        <TableCaption></TableCaption>
                        <TableHeader>
                            <TableHead className="text-center p-6 font-semibold text-slate-900">
                                Bag Details
                            </TableHead>
                            <TableHead className="text-center p-6 font-semibold text-slate-900">
                                Blood Group
                            </TableHead>
                            <TableHead className="text-center p-6 font-semibold text-slate-900">
                                Component
                            </TableHead>
                            <TableHead className="text-center p-6 font-semibold text-slate-900">
                                Amount
                            </TableHead>
                            <TableHead className="text-center p-6 font-semibold text-slate-900">
                                Expiry Date
                            </TableHead>
                            <TableHead className="text-center p-6 font-semibold text-slate-900">
                                Action
                            </TableHead>
                        </TableHeader>
                        <TableBody>
                            {bloodBags?.map((bag) => (
                                <TableRow key={bag.id}>
                                    <TableCell className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center mx-auto gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center text-red-700 text-sm font-bold shadow-sm border border-white">
                                                    <Droplets className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold text-slate-900 truncate">
                                                        ID: {bag.id.slice(0, 8)}
                                                        ...
                                                    </div>
                                                    <div className="text-sm text-slate-600 truncate">
                                                        Donation:{' '}
                                                        {bag.donation_id.slice(
                                                            0,
                                                            8,
                                                        )}
                                                        ...
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-6">
                                        <div>
                                            <Badge
                                                className={`block mx-auto px-3 py-1 font-semibold ${bloodGroupColors[bag.blood_group]}`}
                                            >
                                                {normalizeBloodGroup(
                                                    bag.blood_group,
                                                )}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-6">
                                        <div>
                                            <Badge
                                                className={`block mx-auto px-3 py-1 font-semibold ${componentColors[bag.component]}`}
                                            >
                                                {capitalCase(bag.component)}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-6">
                                        <div className="flex items-center gap-2">
                                            <div className="mx-auto flex gap-2">
                                                <Droplets className="h-4 w-4 text-red-500" />
                                                <span className="font-semibold text-slate-900">
                                                    {bag.amount} ml
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="p-6">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-2 mx-auto">
                                                <Calendar className="h-4 w-4 text-slate-400" />
                                                <span
                                                    className={`${
                                                        isExpired(
                                                            bag.expired_time,
                                                        )
                                                            ? 'text-red-600 font-semibold'
                                                            : isExpiringSoon(
                                                                    bag.expired_time,
                                                                )
                                                              ? 'text-orange-600 font-semibold'
                                                              : 'text-slate-600'
                                                    }`}
                                                >
                                                    {formatDateTime(
                                                        new Date(
                                                            bag.expired_time,
                                                        ),
                                                    )}
                                                </span>
                                                {isExpired(
                                                    bag.expired_time,
                                                ) && (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                )}
                                                {isExpiringSoon(
                                                    bag.expired_time,
                                                ) && (
                                                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-6">
                                        <div className="flex gap-2">
                                            <div className="mx-auto">
                                                {!bag.is_used &&
                                                    !isExpired(
                                                        bag.expired_time,
                                                    ) && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedBag(
                                                                    bag,
                                                                );
                                                                setShowUseDialog(
                                                                    true,
                                                                );
                                                            }}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                                        >
                                                            <Activity className="h-3 w-3 mr-1" />
                                                            Mark as Used
                                                        </Button>
                                                    )}
                                                {bag.is_used && (
                                                    <Badge className="bg-gray-100 text-gray-800 border-gray-200 px-3 py-1">
                                                        <Activity className="h-3 w-3 mr-1" />
                                                        Used
                                                    </Badge>
                                                )}
                                                {isExpired(bag.expired_time) &&
                                                    !bag.is_used && (
                                                        <Badge className="bg-red-100 text-red-800 border-red-200 px-3 py-1">
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            Expired
                                                        </Badge>
                                                    )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
