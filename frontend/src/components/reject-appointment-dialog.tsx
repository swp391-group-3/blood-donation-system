'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRejectAppointment } from '@/hooks/use-reject-appointment';

interface RejectAppointmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    appointmentId: string;
}

export const RejectAppointmentDialog = ({
    open,
    onOpenChange,
    appointmentId,
}: RejectAppointmentDialogProps) => {
    const [isBanned, setIsBanned] = useState(false);
    const [reason, setReason] = useState('');
    const reject = useRejectAppointment(appointmentId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="is-banned"
                        checked={isBanned}
                        onCheckedChange={(checked) =>
                            setIsBanned(checked === true)
                        }
                    />
                    <label
                        htmlFor="is-banned"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Permanently ban this user
                    </label>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!reason || reject.isPending}
                        onClick={() =>
                            reject.mutate({
                                reason,
                                isBanned,
                            })
                        }
                    >
                        {reject.isPending ? 'Rejecting...' : 'Confirm Reject'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
