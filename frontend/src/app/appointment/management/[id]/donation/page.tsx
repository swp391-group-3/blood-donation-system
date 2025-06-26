'use client';

import type React from 'react';
import { User, Heart, Clock, Target, X, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { useAppointment } from '@/hooks/use-appointent';
import { capitalCase } from 'change-case';
import { DonationForm } from '@/components/donation-form';
import { formatDateTime, generateDonationLabel } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRejectAppointment } from '@/hooks/use-reject-appointment';

export default function AppointmentDonationPage() {
    const { id } = useParams<{ id: string }>();
    const { data: apt, isPending, error } = useAppointment(id);
    const reject = useRejectAppointment(id);

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
                                    {apt.member.name}
                                </h2>
                                <div className="flex items-center space-x-4 mb-3">
                                    <Badge className="bg-red-100 text-red-700 border-red-200 px-3 py-1">
                                        <Heart className="h-3 w-3 mr-1" />
                                        {
                                            bloodGroupLabels[
                                                apt.member.blood_group
                                            ]
                                        }
                                    </Badge>
                                    <span className="text-slate-600 font-medium">
                                        {capitalCase(apt.member.gender)}, Age{' '}
                                        {new Date().getFullYear() -
                                            Number(
                                                apt.member.birthday.substring(
                                                    0,
                                                    4,
                                                ),
                                            )}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-600">
                                    {apt.member.phone} • {apt.member.email}
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
                        <CardHeader>
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
                                        onClick={() => {
                                            reject.mutate();
                                        }}
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
                                                        apt.member,
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
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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
                                        {blood_bags.length}
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

                            {/* Progress Bar */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-700">
                                        Collection Progress
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        {Math.round(completionProgress)}%
                                    </span>
                                </div>
                                <Progress
                                    value={completionProgress}
                                    className="h-3 bg-blue-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-600"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
