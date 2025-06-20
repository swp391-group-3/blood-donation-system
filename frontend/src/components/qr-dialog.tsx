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
import { toast } from 'sonner';

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
        <Dialog open={!!url} onOpenChange={onReset}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{children}</DialogTitle>
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
