'use client';

import { ColumnDef } from '@tanstack/react-table';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { Badge } from '@/components/ui/badge';
import { capitalCase } from 'change-case';
import {
    Droplets,
    Calendar,
    XCircle,
    AlertTriangle,
    Clock,
    LucideIcon,
    CheckCircle,
    Stethoscope,
    Eye,
    PlusSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Appointment, Status } from '@/lib/api/dto/appointment';
import { useAccount } from '@/hooks/use-account';
import { AccountPicture } from '@/components/account-picture';
import { toast } from 'sonner';
import { useBloodRequest } from '@/hooks/use-blood-request';
import { ReviewDialog } from '@/components/review-dialog';
import Link from 'next/link';

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

const AccountCell = ({ id }: { id: string }) => {
    const { data: account, isPending, error } = useAccount(id);

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error(error.message);
        return <div></div>;
    }

    return (
        <div className="flex items-center gap-4">
            <div className="size-10">
                <AccountPicture name={account.name} />
            </div>
            <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900 truncate">
                    {account.name}
                </div>
                <div className="text-sm text-slate-600 truncate">
                    {account.email}
                </div>
            </div>
        </div>
    );
};

const BloodTypeCell = ({ accountId }: { accountId: string }) => {
    const { data: account, isPending, error } = useAccount(accountId);

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error(error.message);
        return <div></div>;
    }

    return (
        <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-red-500" />
            <span className="font-semibold text-red-600">
                {bloodGroupLabels[account.blood_group]}
            </span>
        </div>
    );
};

const PriorityCell = ({ requestId }: { requestId: string }) => {
    const { data: request, isPending, error } = useBloodRequest(requestId);

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error(error.message);
        return <div></div>;
    }

    const config = priorityConfigs[request.priority];

    return (
        <Badge className={`text-md px-3 py-1 font-semibold ${config.color}`}>
            <config.icon className="size-8" />
            <span className="ml-2">{capitalCase(request.priority)}</span>
        </Badge>
    );
};

export const columns: ColumnDef<Appointment>[] = [
    {
        header: 'Donor',
        accessorKey: 'donor_id',
        cell: ({ row }) => <AccountCell id={row.original.donor_id} />,
    },
    {
        header: 'Blood Type',
        accessorKey: 'donor_id',
        cell: ({ row }) => <BloodTypeCell accountId={row.original.donor_id} />,
    },
    {
        header: 'Priority',
        accessorKey: 'request_id',
        cell: ({ row }) => <PriorityCell requestId={row.original.request_id} />,
    },
    {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
            const config = statusConfigs[row.original.status];

            return (
                <Badge
                    className={`text-md px-3 py-1 font-semibold ${config.color}`}
                >
                    <config.icon className="size-8" />
                    <span className="ml-2">
                        {capitalCase(row.getValue('status'))}
                    </span>
                </Badge>
            );
        },
    },
    {
        header: 'Action',
        accessorKey: 'status',
        cell: ({ row }) => {
            const id = row.original.id;
            const status = row.original.status;

            return (
                <>
                    {status === 'on_process' && (
                        <ReviewDialog appointment={row.original}>
                            <Button
                                size="sm"
                                className="bg-lime-600 hover:bg-lime-700 text-white rounded-lg"
                            >
                                <Eye className="h-3 w-3 mr-1" />
                                Review
                            </Button>
                        </ReviewDialog>
                    )}

                    {status === 'approved' && (
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

                    {status === 'checked_in' && (
                        <Link href={`/appointment/management/${id}/donation`}>
                            <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                                <Droplets className="h-3 w-3 mr-1" />
                                Donation
                            </Button>
                        </Link>
                    )}

                    {status === 'donated' && (
                        <Link href={`/appointment/management/${id}/donation`}>
                            <Button
                                size="sm"
                                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 rounded-lg"
                            >
                                <PlusSquare className="h-3 w-3 mr-1" />
                                Add Blood Bags
                            </Button>
                        </Link>
                    )}
                </>
            );
        },
    },
];
