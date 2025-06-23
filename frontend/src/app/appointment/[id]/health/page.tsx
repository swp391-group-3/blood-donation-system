'use client';

import { HealthForm } from '@/components/health-form';
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

    return <HealthForm appointmentId={id} />;
}
