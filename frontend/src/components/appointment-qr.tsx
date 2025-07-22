'use client';

import { PropsWithChildren, useRef, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { Appointment } from '@/lib/service/appointment';

const generateUrl = (appointment: Appointment): string => {
    switch (appointment.status) {
        case 'approved':
            return `${window.location.href}/management/${appointment.id}/health`;
        case 'checked_in':
            return `${window.location.href}/management/${appointment.id}/donation`;
        default:
            return '';
    }
};

interface Props {
    appointment: Appointment;
    size?: number;
}

export const AppointmentQR = ({
    children,
    appointment,
    size = 256,
}: PropsWithChildren<Props>) => {
    const url = generateUrl(appointment);
    const qrRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const svgElement = qrRef.current?.querySelector('svg');
        if (svgElement) {
            const serializer = new XMLSerializer();
            const svgBlob = new Blob(
                [serializer.serializeToString(svgElement)],
                {
                    type: 'image/svg+xml',
                },
            );
            const url = URL.createObjectURL(svgBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'qrcode.svg';
            link.click();
            URL.revokeObjectURL(url);
        }
    };
    const handleShare = async () => {
        toast.promise(navigator.clipboard.writeText(url ?? ''), {
            loading: 'Loading...',
            success: () => {
                return 'Link copied';
            },
            error: 'Error',
        });
    };

    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <p className="font-semibold text-slate-900 text-lg">
                            Check-in QR
                        </p>
                        <p className="text-xs text-slate-500">
                            #{appointment.id}
                        </p>
                    </DialogTitle>
                </DialogHeader>
                {url && (
                    <div ref={qrRef}>
                        <QRCodeSVG
                            size={size}
                            className="mx-auto"
                            value={url}
                        />
                    </div>
                )}
                <DialogFooter className="flex gap-5">
                    <Button
                        variant="outline"
                        onClick={handleDownload}
                        className="flex-1"
                    >
                        <Download className="mr-1" />
                        Save
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleShare}
                        className="flex-1"
                    >
                        <Share2 className="mr-1" />
                        Share
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
