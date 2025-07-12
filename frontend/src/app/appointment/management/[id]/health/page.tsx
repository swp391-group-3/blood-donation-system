'use client';

import type React from 'react';
import { User, Heart, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { HealthForm } from '@/components/health-form';
import { useAppointment } from '@/hooks/use-appointent';
import { capitalCase } from 'change-case';

export default function AppointmentHealthPage() {
    const { id } = useParams<{ id: string }>();
    const { data: apt, isPending, error } = useAppointment(id);

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
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
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
                            <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
                                <div className="flex justify-end items-center text-blue-600 text-sm mb-2">
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
                                <div className="text-xs text-blue-600 mt-2 font-medium">
                                    {apt.request.title}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div>
                <HealthForm appointmentId={id} />
            </div>
        </div>
    );
}
