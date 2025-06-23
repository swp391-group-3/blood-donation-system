'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { Appointment } from '@/lib/api/dto/appointment';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function AppointmentPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await fetchWrapper(`/appointment/${id}`);

                const appointment = await deserialize<Appointment>(response);
                if (!appointment.request) {
                    toast.error(
                        'Blood request has not been started or is ended',
                    );
                    router.push('/');
                    return;
                }
                if (!appointment.health) {
                    router.push(`/appointment/${id}/health`);
                    return;
                }

                router.push(`/appointment/${id}/donation`);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        };

        fetchAppointment();
    }, [id, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Loading appointment details...</p>
        </div>
    );
}
