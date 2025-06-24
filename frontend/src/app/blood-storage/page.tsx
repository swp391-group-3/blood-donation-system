'use client';
import { useMemo, useState } from 'react';
import {
    Hero,
    HeroDescription,
    HeroKeyword,
    HeroSummary,
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
    Search,
    TriangleAlert,
    XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useBloodStorageList } from '@/hooks/use-blood-storage-list';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { priorities } from '@/lib/api/dto/blood-request';
import { capitalCase } from 'change-case';
import { bloodGroupLabels, bloodGroups } from '@/lib/api/dto/blood-group';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils';
import {
    differenceInCalendarISOWeeks,
    differenceInCalendarWeeks,
} from 'date-fns';

const getStats = (bloodInventory: BloodBag[]): StatsProps[] => {
    return [
        {
            label: 'Total Bags',
            value: 5,
            icon: Package,
            description: 'Complete Inventory',
            color: 'blue',
        },
        {
            label: 'Available',
            value: 1,
            icon: Check,
            description: 'Ready for use',
            color: 'green',
        },
        {
            label: 'Expiring Soon',
            value: 0,
            icon: TriangleAlert,
            description: 'Within 7 days',
            color: 'yellow',
        },
        {
            label: 'Expired',
            value: 0,
            icon: CircleX,
            description: 'Requires disposal',
            color: 'rose',
        },
    ];
};

const colors: Record<BloodComponent, string> = {
    plasma: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    red_cell: 'bg-red-100 text-red-800 border-red-200',
    platelet: 'bg-blue-100 text-blue-800 border-blue-200',
};

function getStatusText(bag: BloodBag): string {
    if (bag.is_used) {
        return 'Used';
    }

    const now = new Date();
    const expiredTime = new Date(bag.expired_time);
    const soonThreshold = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (expiredTime <= now) {
        return 'Expired';
    } else if (expiredTime <= soonThreshold) {
        return 'Expiring Soon';
    } else {
        return 'Available';
    }
}

const isExpired = (date: Date) => new Date(date) <= new Date();

const isExpiringSoon = (date: Date) =>
    differenceInCalendarWeeks(new Date(), new Date(date)) <= 1;

function getStatusColor(bag: BloodBag): string {
    if (bag.is_used) {
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }

    const now = new Date();
    const expiredTime = new Date(bag.expired_time);
    const soonThreshold = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (expiredTime <= now) {
        return 'bg-red-100 text-red-800 border-red-200';
    } else if (expiredTime <= soonThreshold) {
        return 'bg-orange-100 text-orange-800 border-orange-200';
    } else {
        return 'bg-green-100 text-green-800 border-green-200';
    }
}

export default function BloodStorage() {
    const [selectedBag, setSelectedBag] = useState<BloodBag | null>(null);
    const [showUseDialog, setShowUseDialog] = useState(false);
    const { data: bloodBags, isPending, error } = useBloodStorageList();
    const stats = useMemo(
        () => (bloodBags ? getStats(bloodBags) : undefined),
        [bloodBags],
    );
    const [search, setSearch] = useState<String | undefined>();

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
                    <Button className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25 font-medium rounded-xl">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Blood Request
                    </Button>
                    <div className="flex gap-3">
                        <Select>
                            <SelectTrigger className="w-fit border-slate-200">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Component" />
                            </SelectTrigger>
                            <SelectContent>
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

                        <Select>
                            <SelectTrigger className="w-fit border-slate-200">
                                <Droplet className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Blood Group" />
                            </SelectTrigger>
                            <SelectContent>
                                {bloodGroups.map((group) => (
                                    <SelectItem key={group} value={group}>
                                        {bloodGroupLabels[group]}
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
                            {bloodBags.map((bag) => (
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
                                                className={`block mx-auto px-3 py-1 font-semibold ${colors[bag.component]}`}
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
            </div>
        </div>
    );
}
