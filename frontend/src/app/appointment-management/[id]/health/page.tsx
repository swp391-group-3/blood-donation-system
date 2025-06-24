'use client';

import type React from 'react';
import {
    User,
    Droplets,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import { useAccount } from '@/hooks/use-account';
import { useAppointment } from '@/hooks/use-appointment';
import { toast } from 'sonner';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { useBloodRequest } from '@/hooks/use-blood-request';
import { HealthForm } from '@/components/health-form';

export default function AppointmentHealthPage() {
    const { id } = useParams<{ id: string }>();
    const { data: appointment } = useAppointment(id);
    const {
        data: member,
        isPending,
        error,
    } = useAccount(appointment?.member_id);
    const { data: request } = useBloodRequest(appointment?.request_id);

    if (isPending || !request) {
        return <div></div>;
    }

    if (error) {
        toast.error(error.message);
        return <div></div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <Card>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {member.name}
                                </h2>
                                <div className="flex items-center space-x-4 mt-1">
                                    <Badge
                                        variant="outline"
                                        className="text-red-600 border-red-200"
                                    >
                                        <Droplets className="h-3 w-3 mr-1" />
                                        {
                                            bloodGroupLabels[
                                                member.blood_group
                                            ]
                                        }
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                        Age:{' '}
                                        {new Date().getFullYear() -
                                            Number(
                                                member.birthday.substring(
                                                    0,
                                                    4,
                                                ),
                                            )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div>
                <HealthForm appointmentId={id}/>
            </div>
        </div>
    );
}
