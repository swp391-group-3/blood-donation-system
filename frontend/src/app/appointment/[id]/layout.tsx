'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAppointment } from '@/hooks/use-appointment';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { Droplets, User } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

export default function AppointmentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
                                    {appointment.member.name}
                                </h2>
                                <div className="flex items-center space-x-4 mt-1">
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
                                    <span className="text-sm text-gray-500">
                                        Age:{' '}
                                        {new Date().getFullYear() -
                                            Number(
                                                appointment.member.birthday.substring(
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
            <div>{children}</div>
        </div>
    );
}
