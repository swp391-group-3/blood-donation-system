'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PropsWithChildren, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { rejectAppointment } from '@/lib/service/appointment';
import { ApiError } from '@/lib/service';
import { toast } from 'sonner';
import { DialogTrigger } from '@radix-ui/react-dialog';

interface Props {
    id: string;
}

export const RejectAppointmentDialog = ({
    children,
    id,
}: PropsWithChildren<Props>) => {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const mutation = useMutation({
        mutationFn: async (reason: string) => rejectAppointment(id, { reason }),
        onError: (error: ApiError) => toast.error(error.message),
        onSuccess: () => {
            toast.info('Appointment rejected');
            setOpen(false);
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject Appointment</DialogTitle>
                </DialogHeader>
                <div>
                    <label className="text-sm font-medium">Reason</label>
                    <Input
                        placeholder="Your blood type is not compatible..."
                        className="mt-2"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!reason || mutation.isPending}
                        onClick={() => mutation.mutate(reason)}
                    >
                        {mutation.isPending ? 'Rejecting...' : 'Confirm Reject'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
