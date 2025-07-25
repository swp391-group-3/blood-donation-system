import React from 'react';
import { Card, CardHeader, CardContent} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const RequestCardSkeleton = () => {
    return (
        <Card className="flex flex-col h-full border-zinc-100 rounded-lg shadow-xs shadow-black/20 transition-all duration-200 animate-pulse">
            <CardHeader className="p-6 flex-1">
                <div className="flex items-start gap-4 mb-4 bg-slate-100">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/5 rounded" />
                        <Skeleton className="h-3 w-1/4 rounded" />
                    </div>
                </div>
                <div>
                    <Skeleton className="h-3 w-1/3 rounded mb-2" />
                    <div className="flex flex-wrap gap-1.5 bg-slate-100">
                        <Skeleton className="h-6 w-12 rounded-full" />
                        <Skeleton className="h-6 w-12 rounded-full" />
                        <Skeleton className="h-6 w-12 rounded-full" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {[...Array(4)].map((_, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg">
                            <Skeleton className="h-4 w-4 rounded" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-4 w-1/2 rounded" />
                                <Skeleton className="h-3 w-1/3 rounded" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-3 mb-6 bg-slate-100">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-2 w-full rounded-full" />
                    <Skeleton className="h-3 w-2/3 rounded" />
                </div>

                <Skeleton className="h-10 w-1/2 rounded-full mx-auto" />
            </CardContent>
        </Card>
    );
};
