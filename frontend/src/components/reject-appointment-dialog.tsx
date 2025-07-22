'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
                <Label className="hover:bg-accent/50 mt-4 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                    <Checkbox
                        id="is-banned"
                        checked={isBanned}
                        onCheckedChange={(checked) => setIsBanned(!checked)}
                        className="data-[state=checked]:border-rose-600 data-[state=checked]:bg-rose-600 data-[state=checked]:text-white dark:data-[state=checked]:border-rose-700 dark:data-[state=checked]:bg-rose-700"
                    />
                    <div className="grid gap-1.5 font-normal">
                        <p className="text-sm leading-none font-medium">
                            Ban permanently this user
                        </p>
                    </div>
                </Label>
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
                                isBanned: isBanned,
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
