import { PropsWithChildren } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { Search } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

export const CardGrid = ({
    className,
    children,
}: PropsWithChildren<{ className?: string }>) => {
    return (
        <div className={cn('grid grid-cols-1 gap-10', className)}>
            {React.Children.count(children) === 0 ? (
                <EmptyState
                    className="mx-auto col-span-full"
                    title="No Results Found"
                    description="Try adjusting your search filters."
                    icons={[Search]}
                />
            ) : (
                children
            )}
        </div>
    );
};
