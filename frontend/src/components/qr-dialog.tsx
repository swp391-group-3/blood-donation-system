import { PropsWithChildren, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const size = 256;

export const QRDialog = ({
    children,
    url,
    onReset,
}: PropsWithChildren<{
    url?: string;
    onReset: () => void;
}>) => {
    const qrRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = size;
        canvas.height = size;
        const img = new Image();
        img.src = `data:image/svg+xml,${encodeURIComponent(qrRef.current?.innerHTML || '')}`;
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'qrcode.png';
            link.click();
        };
    };
    const handleShare = () => {};

    return (
        <Dialog open={!!url} onOpenChange={onReset}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{children}</DialogTitle>
                </DialogHeader>
                {url && (
                    <QRCodeSVG size={size} className="mx-auto" value={url} />
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
