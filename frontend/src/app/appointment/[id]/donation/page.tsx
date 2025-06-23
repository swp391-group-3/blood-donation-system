'use client';

import { DonationForm } from '@/components/donation-form';
import { useAppointment } from '@/hooks/use-appointment';
import { useParams } from 'next/navigation';

export default function AppointmentDonationPage() {
    const { id } = useParams<{ id: string }>();

    return <DonationForm appointmentId={id} />;
}
