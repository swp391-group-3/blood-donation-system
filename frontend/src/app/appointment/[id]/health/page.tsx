'use client';

import { HealthForm } from '@/components/health-form';
import { useParams } from 'next/navigation';

export default function AppointmentHealthPage() {
    const { id } = useParams<{ id: string }>();

    return <HealthForm appointmentId={id} />;
}
