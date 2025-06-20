import { PropsWithChildren } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, QrCodeIcon, Share2 } from 'lucide-react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';

export const QRDialog = ({
    children,
    url,
    onReset,
}: PropsWithChildren<{
    url?: string;
    onReset: () => void;
}>) => {
    const handleDownload = () => {};
    const handleShare = () => {};

    return (
        <Dialog open={!!url} onOpenChange={onReset}>
            <DialogContent className="sm:max-w-sm p-0 overflow-hidden">
                {url && (
                    <Card className="relative">
                        <CardHeader>
                            <CardTitle>{children}</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <QRCodeSVG
                                width={256}
                                height={256}
                                className="mx-auto"
                                value={url}
                            />
                        </CardContent>

                        <CardFooter className="flex gap-5">
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
                        </CardFooter>
                    </Card>
                )}
            </DialogContent>
        </Dialog>
    );
};
