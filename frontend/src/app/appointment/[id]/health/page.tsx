'use client';

import { MemberCard } from '@/components/member-card';
import { useAppointment } from '@/hooks/use-appointment';
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <MemberCard member={appointment.member} />
            </div>
            <div className="lg:col-span-3"></div>
        </div>
    );
}
