'use client';

import { ColumnDef } from '@tanstack/react-table';
import { BloodBag } from '@/lib/api/dto/blood-bag';
import { bloodGroupLabels, BloodGroup } from '@/lib/api/dto/blood-group';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';
import { capitalCase } from 'change-case';
import {
    Droplets,
    Calendar,
    XCircle,
    AlertTriangle,
    Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const isExpired = (date: Date) => new Date(date) <= new Date();

const isExpiringSoon = (date: Date) => {
    const now = new Date();
    const diffDays = Math.ceil(
        (new Date(date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diffDays > 0 && diffDays <= 7;
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

const componentColors = {
    plasma: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    red_cell: 'bg-red-100 text-red-800 border-red-200',
    platelet: 'bg-blue-100 text-blue-800 border-blue-200',
};

export const getColumns = (
    onMarkAsUsed: (bag: BloodBag) => void,
): ColumnDef<BloodBag>[] => [
    {
        header: 'Bag Details',
        accessorKey: 'id',
        cell: ({ row }) => {
            const bag = row.original;
            return (
                <div className="flex items-center gap-4">
                    <div className="flex items-center mx-auto gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center text-red-700 text-sm font-bold shadow-sm border border-white">
                            <Droplets className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="font-semibold text-slate-900 truncate">
                                ID: {bag.id.slice(0, 8)}...
                            </div>
                            <div className="text-sm text-slate-600 truncate">
                                Donation: {bag.donation_id.slice(0, 8)}...
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        header: 'Blood Group',
        accessorKey: 'blood_group',
        cell: ({ row }) => {
            const group = row.original.blood_group;
            return (
                <Badge
                    className={`block mx-auto px-3 py-1 font-semibold ${bloodGroupColors[group]}`}
                >
                    {bloodGroupLabels[group]}
                </Badge>
            );
        },
    },
    {
        header: 'Component',
        accessorKey: 'component',
        cell: ({ row }) => {
            const component = row.original.component;
            return (
                <Badge
                    className={`block mx-auto px-3 py-1 font-semibold ${componentColors[component]}`}
                >
                    {capitalCase(component)}
                </Badge>
            );
        },
    },
    {
        header: 'Amount',
        accessorKey: 'amount',
        cell: ({ row }) => {
            const amount = row.original.amount;
            return (
                <div className="mx-auto flex gap-2 items-center">
                    <Droplets className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-slate-900">
                        {amount} ml
                    </span>
                </div>
            );
        },
    },
    {
        header: 'Expiry Date',
        accessorKey: 'expired_time',
        cell: ({ row }) => {
            const time = new Date(row.original.expired_time);
            return (
                <div className="flex gap-2 items-center mx-auto">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span
                        className={`${
                            isExpired(time)
                                ? 'text-red-600 font-semibold'
                                : isExpiringSoon(time)
                                  ? 'text-orange-600 font-semibold'
                                  : 'text-slate-600'
                        }`}
                    >
                        {formatDateTime(time)}
                    </span>
                    {isExpired(time) && (
                        <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    {!isExpired(time) && isExpiringSoon(time) && (
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                </div>
            );
        },
    },
    {
        header: 'Action',
        id: 'action',
        cell: ({ row }) => {
            const bag = row.original;
            if (bag.is_used) {
                return (
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200 px-3 py-1">
                        <Activity className="h-3 w-3 mr-1" />
                        Used
                    </Badge>
                );
            }

            if (isExpired(new Date(bag.expired_time))) {
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-200 px-3 py-1">
                        <XCircle className="h-3 w-3 mr-1" />
                        Expired
                    </Badge>
                );
            }

            return (
                <Button
                    size="sm"
                    onClick={() => onMarkAsUsed(bag)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                    <Activity className="h-3 w-3 mr-1" />
                    Mark as Used
                </Button>
            );
        },
    },
];
