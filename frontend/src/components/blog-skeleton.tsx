import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogCardSkeleton() {
    return (
        <Card className="flex flex-col h-full border-zinc-50 rounded-lg shadow-xs shadow-black/20g transition-all duration-200">
            <CardHeader className="flex-1 pt-1 pb-2 px-5">
                <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-4 w-24 rounded" />
                        <Skeleton className="h-3 w-16 rounded" />
                    </div>
                </div>
                <CardTitle className="block text-base font-semibold text-zinc-900 leading-snug mb-2 line-clamp-2">
                    <Skeleton className="h-4 w-full mb-1 rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                </CardTitle>
                <CardContent className="p-0">
                    <div className="space-y-1 mb-3 min-h-[56px]">
                        <Skeleton className="h-3 w-full rounded" />
                        <Skeleton className="h-3 w-full rounded" />
                        <Skeleton className="h-3 w-5/6 rounded" />
                    </div>
                </CardContent>
            </CardHeader>
            <div className="flex-1 flex flex-col justify-end">
                <div className="flex flex-wrap gap-1.5 px-5 pb-4">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-10 rounded-full" />
                </div>
            </div>
        </Card>
    );
}