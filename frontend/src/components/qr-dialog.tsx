import { PropsWithChildren } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Download, Share2 } from 'lucide-react';

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
                    <div className="relative">
                        <div className="flex items-center gap-3 p-6 pb-4">
                            {children}
                        </div>

                        <div className="px-6 pb-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-center">
                                <canvas
                                    className="max-w-full h-auto"
                                    width={200}
                                    height={200}
                                />
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownload}
                                    className="flex-1 text-xs"
                                >
                                    <Download className="h-3 w-3 mr-1" />
                                    Save
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleShare}
                                    className="flex-1 text-xs"
                                >
                                    <Share2 className="h-3 w-3 mr-1" />
                                    Share
                                </Button>
                            </div>

                            <p className="text-xs text-slate-500 text-center mt-3">
                                Scan at donation center for quick check-in
                            </p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
