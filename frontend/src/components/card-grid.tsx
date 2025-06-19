import { PropsWithChildren } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { Search } from 'lucide-react';
import React from 'react';

export const CardGrid = ({ children }: PropsWithChildren) => {
    return (
        <div className="space-y-10">
            {React.Children.count(children) === 0 ? (
                <EmptyState
                    className="mx-auto"
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
