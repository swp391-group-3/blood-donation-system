'use client';

import { DonationForm } from '@/components/donation-form';
import { useAppointment } from '@/hooks/use-appointment';
import { useParams } from 'next/navigation';

export default function AppointmentDonationPage() {
    const { id } = useParams<{ id: string }>();
    const { data: appointment, isPending, error } = useAppointment(id);

    return <DonationForm appointmentId={id} />;
}
