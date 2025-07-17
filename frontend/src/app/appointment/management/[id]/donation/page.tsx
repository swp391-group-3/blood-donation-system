'use client';

import type React from 'react';
import {
    User,
    Heart,
    Clock,
    Target,
    X,
    Printer,
    Package,
    CheckCircle,
    Plus,
    Info,
    Droplets,
    Sparkles,
    Beaker,
    Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { useAppointment } from '@/hooks/use-appointent';
import { capitalCase } from 'change-case';
import { DonationForm } from '@/components/donation-form';
import { formatDateTime, generateDonationLabel } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRejectAppointment } from '@/hooks/use-reject-appointment';
import { useMemo, useState } from 'react';
import {
    BloodComponent,
    bloodComponents,
    CreateBloodBag,
} from '@/lib/api/dto/blood-bag';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { useCreateBloodBags } from '@/hooks/use-create-blood-bags';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const componentConfigs = {
    red_cell: {
        icon: Droplets,
        shelfLife: '42 days',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
    },
    platelet: {
        icon: Sparkles,
        shelfLife: '5 days',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
    },
    plasma: {
        icon: Beaker,
        shelfLife: '1 year',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
    },
};

function calculateExpectedExpiryDate(shelfLife: string): Date {
    const now = new Date();
    const [valueStr, unit] = shelfLife.split(' ');
    const value = parseInt(valueStr);

    if (unit.includes('day')) now.setDate(now.getDate() + value);
    else if (unit.includes('month')) now.setMonth(now.getMonth() + value);
    else if (unit.includes('year')) now.setFullYear(now.getFullYear() + value);

    return now;
}

export default function AppointmentDonationPage() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const { id } = useParams<{ id: string }>();
    const { data: apt, isPending, error } = useAppointment(id);
    const reject = useRejectAppointment(id);
    const createBloodBag = useCreateBloodBags();

    const [newBloodBag, setNewBloodBag] = useState<CreateBloodBag>({
        amount: 150,
        component: 'red_cell',
        expired_time: new Date(),
    });
    const [bloodBags, setBloodBags] = useState<CreateBloodBag[]>([]);
    const totalBagAmount = useMemo(
        () => bloodBags.reduce((prev, bag) => prev + bag.amount, 0),
        [bloodBags],
    );

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error(error.message);
        return <div></div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
            <Card>
                <CardContent className="px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                                <User className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    {apt.donor.name}
                                </h2>
                                <div className="flex items-center space-x-4 mb-3">
                                    <Badge className="bg-red-100 text-red-700 border-red-200 px-3 py-1">
                                        <Heart className="h-3 w-3 mr-1" />
                                        {
                                            bloodGroupLabels[
                                                apt.donor.blood_group
                                            ]
                                        }
                                    </Badge>
                                    <span className="text-slate-600 font-medium">
                                        {capitalCase(apt.donor.gender)}, Age{' '}
                                        {new Date().getFullYear() -
                                            Number(
                                                apt.donor.birthday.substring(
                                                    0,
                                                    4,
                                                ),
                                            )}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-600">
                                    {apt.donor.phone} • {apt.donor.email}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="bg-red-50 rounded-xl p-8 border border-red-200">
                                <div className="flex justify-end items-center text-red-600 text-sm mb-2">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span className="font-medium">
                                        Appointment
                                    </span>
                                </div>
                                <div className="text-lg font-bold text-slate-900">
                                    {new Date(
                                        apt.request.start_time,
                                    ).toLocaleDateString()}{' '}
                                    -{' '}
                                    {new Date(
                                        apt.request.end_time,
                                    ).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-slate-600">
                                    {new Date(
                                        apt.request.start_time,
                                    ).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                                <div className="text-xs text-red-600 mt-2 font-medium">
                                    {apt.request.title}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {apt.status === 'checked_in' && (
                <DonationForm appointmentId={apt.id} />
            )}
            {apt.status === 'donated' && (
                <>
                    <Card>
                        <CardHeader className="border-b border-blue-200/50">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/25">
                                        <Target className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-xl font-bold text-slate-900">
                                            Donation Record
                                        </span>
                                        <div className="text-sm text-slate-600 mt-1">
                                            Creation time:{' '}
                                            {formatDateTime(
                                                new Date(
                                                    apt.donation.created_at,
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={reject.isPending}
                                        onClick={() => setOpen(true)}
                                        className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
                                    >
                                        {reject.isPending ? (
                                            <p>Loading ...</p>
                                        ) : (
                                            <>
                                                <X className="h-4 w-4 mr-2" />
                                                Reject Donation
                                            </>
                                        )}
                                    </Button>

                                    <Dialog open={open} onOpenChange={setOpen}>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Reject Appointment
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div>
                                                <label className="text-sm font-medium">
                                                    Reason
                                                </label>
                                                <Input
                                                    placeholder="Your blood type is not compatible..."
                                                    className="mt-2"
                                                    value={reason}
                                                    onChange={(e) =>
                                                        setReason(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        setOpen(false)
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    disabled={
                                                        !reason ||
                                                        reject.isPending
                                                    }
                                                    onClick={() =>
                                                        reject.mutate(reason)
                                                    }
                                                >
                                                    {reject.isPending
                                                        ? 'Rejecting...'
                                                        : 'Confirm Reject'}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="bg-white/80 hover:bg-white"
                                        onClick={async () => {
                                            const printWindow = window.open(
                                                '',
                                                '_blank',
                                            );
                                            if (printWindow) {
                                                printWindow.document.write(
                                                    await generateDonationLabel(
                                                        apt.donation,
                                                        apt.donor,
                                                    ),
                                                );
                                                printWindow.document.close();
                                                printWindow.focus();
                                            }
                                        }}
                                    >
                                        <Printer className="h-4 w-4 mr-2" />
                                        Print Label
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-900 mb-2">
                                        {capitalCase(apt.donation.type)}
                                    </div>
                                    <div className="text-slate-600">
                                        Donation Type
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-900 mb-2">
                                        {apt.donation.amount}ml
                                    </div>
                                    <div className="text-slate-600">
                                        Collection Volume
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-900 mb-2">
                                        {bloodBags.length}
                                    </div>
                                    <div className="text-slate-600">
                                        Components
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-900 mb-2">
                                        {totalBagAmount}ml
                                    </div>
                                    <div className="text-slate-600">
                                        Total Processed
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-500/25">
                                        <Package className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-xl font-bold text-slate-900">
                                            Blood Components
                                        </span>
                                        <div className="text-sm text-slate-600 mt-1">
                                            Add and manage blood components
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {bloodBags.length > 0 && (
                                        <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            {bloodBags.length} component
                                            {bloodBags.length !== 1 ? 's' : ''}
                                        </Badge>
                                    )}
                                </div>
                            </CardTitle>
                            <CardContent className="px-0 py-8 space-y-8">
                                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-6">
                                        Add New Component
                                    </h3>
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div>
                                            <Label className="text-sm font-medium text-slate-700 mb-3 block">
                                                Component Type
                                            </Label>
                                            <Select
                                                value={newBloodBag.component}
                                                onValueChange={(
                                                    component: BloodComponent,
                                                ) => {
                                                    const shelfLife =
                                                        componentConfigs[
                                                            component
                                                        ].shelfLife;
                                                    const estimatedDate =
                                                        calculateExpectedExpiryDate(
                                                            shelfLife,
                                                        );

                                                    setNewBloodBag((prev) => ({
                                                        ...prev,
                                                        component,
                                                        expired_time:
                                                            estimatedDate,
                                                    }));
                                                }}
                                            >
                                                <SelectTrigger className="transition-all w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {bloodComponents.map(
                                                        (component) => {
                                                            const config =
                                                                componentConfigs[
                                                                    component
                                                                ];

                                                            return (
                                                                <SelectItem
                                                                    key={
                                                                        component
                                                                    }
                                                                    value={
                                                                        component
                                                                    }
                                                                >
                                                                    <div className="flex items-center space-x-3">
                                                                        <config.icon
                                                                            className={`h-5 w-5 ${config.color}`}
                                                                        />
                                                                        <span>
                                                                            {capitalCase(
                                                                                component,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </SelectItem>
                                                            );
                                                        },
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-slate-700 mb-3 block">
                                                Amount (ml)
                                            </Label>
                                            <Input
                                                type="number"
                                                value={newBloodBag.amount}
                                                onChange={(e) =>
                                                    setNewBloodBag((prev) => ({
                                                        ...prev,
                                                        amount: Number.parseInt(
                                                            e.target.value,
                                                        ),
                                                    }))
                                                }
                                                min="50"
                                                max="500"
                                                placeholder="150"
                                                className="text-center text-lg font-semibold border-2 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-slate-700 mb-3 block">
                                                Expired Time
                                            </Label>
                                            <Input
                                                type="date"
                                                value={
                                                    newBloodBag.expired_time
                                                        .toISOString()
                                                        .split('T')[0]
                                                }
                                                onChange={(e) => {
                                                    setNewBloodBag((prev) => ({
                                                        ...prev,
                                                        expired_time: new Date(
                                                            e.target.value,
                                                        ),
                                                    }));
                                                }}
                                                className="text-center text-base border-2 transition-all"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <Button
                                                type="button"
                                                disabled={
                                                    newBloodBag.amount <= 0
                                                }
                                                onClick={() => {
                                                    setBloodBags((prev) => [
                                                        ...prev,
                                                        { ...newBloodBag },
                                                    ]);
                                                }}
                                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all"
                                            >
                                                <Plus className="h-5 w-5 mr-2" />
                                                Add Component
                                            </Button>
                                        </div>
                                    </div>

                                    <Alert className="mt-6 border-blue-200 bg-blue-50 rounded-xl">
                                        <Info className="h-5 w-5 text-blue-600" />
                                        <AlertDescription className="text-blue-800">
                                            <span>
                                                {capitalCase(
                                                    newBloodBag.component,
                                                )}{' '}
                                                is expected to expire on{' '}
                                                <strong>
                                                    {newBloodBag.expired_time.toLocaleDateString(
                                                        'en-GB',
                                                        {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        },
                                                    )}
                                                </strong>
                                            </span>
                                        </AlertDescription>
                                    </Alert>
                                </div>
                                {bloodBags.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                Added Components (
                                                {bloodBags.length})
                                            </h3>
                                            <span className="text-slate-600 font-medium">
                                                Total: {totalBagAmount}ml
                                            </span>
                                        </div>
                                        {bloodBags.map((bag, index) => {
                                            const component =
                                                bloodComponents.find(
                                                    (c) => c === bag.component,
                                                )!;
                                            const config =
                                                componentConfigs[component];

                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-6 bg-white border-2 border-slate-200 rounded-2xl hover:border-slate-300 transition-all hover:shadow-lg"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div
                                                            className={`p-3 ${config.bgColor} rounded-xl`}
                                                        >
                                                            <config.icon
                                                                className={`h-6 w-6 ${config.color}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900">
                                                                {capitalCase(
                                                                    component,
                                                                )}
                                                            </p>
                                                            <p className="text-sm text-slate-600">
                                                                {bag.amount}
                                                                ml • Expires:{' '}
                                                                {bag.expired_time.toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            setBloodBags(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (
                                                                            _,
                                                                            i,
                                                                        ) =>
                                                                            i !==
                                                                            index,
                                                                    ),
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl transition-all"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <EmptyState
                                        className="mx-auto"
                                        title="No components added yet"
                                        description="Add blood components after collection and processing"
                                        icons={[Package]}
                                    />
                                )}
                            </CardContent>
                        </CardHeader>
                    </Card>
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={createBloodBag.isPending}
                            onClick={() =>
                                createBloodBag.mutate({
                                    appointmentId: apt.id,
                                    donationId: apt.donation.id,
                                    bloodBags,
                                })
                            }
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-6 transition-all"
                        >
                            {createBloodBag.isPending ? (
                                <>
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                    Completing Donation...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-6 w-6 mr-3" />
                                    Complete Donation
                                </>
                            )}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
