'use client';

import { HealthForm } from '@/components/health-form';
import { MemberCard } from '@/components/member-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppointment } from '@/hooks/use-appointment';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { Droplets, User } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

export default function AppointmentHealthPage() {
    const { id } = useParams<{ id: string }>();
    const { data: appointment, isPending, error } = useAppointment(id);

    if (isPending) {
        return <div></div>;
    }
    if (error) {
        toast.error(error.message);
        return <div></div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 lg:col-2 space-y-6">
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold flex items-center space-x-2">
                                <User className="h-4 w-4 text-gray-600" />
                                <span>Member Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <User className="h-8 w-8 text-red-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900">
                                    {appointment.member.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {appointment.member.email}
                                </p>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Blood Type
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="text-red-600 border-red-200"
                                    >
                                        <Droplets className="h-3 w-3 mr-1" />
                                        {
                                            bloodGroupLabels[
                                                appointment.member.blood_group
                                            ]
                                        }
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Age
                                    </span>
                                    <span className="text-sm font-medium">
                                        {new Date().getFullYear() -
                                            Number(
                                                appointment.member.birthday.substring(
                                                    0,
                                                    4,
                                                ),
                                            )}{' '}
                                        years
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Gender
                                    </span>
                                    <span className="text-sm font-medium capitalize">
                                        {appointment.member.gender}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">
                                Reference Ranges
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Temperature
                                    </span>
                                    <span className="font-medium">
                                        36.1-37.2°C
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Weight
                                    </span>
                                    <span className="font-medium">≥50 kg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Heart Rate
                                    </span>
                                    <span className="font-medium">
                                        60-100 bpm
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Blood Pressure
                                    </span>
                                    <span className="font-medium">
                                        {'<140/90'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Hemoglobin
                                    </span>
                                    <span className="font-medium">
                                        ≥12.5 g/dL
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <HealthForm appointmentId={id} />
                </div>
            </div>
        </div>
    );
}
