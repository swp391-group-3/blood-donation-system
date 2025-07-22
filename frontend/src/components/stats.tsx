import { cn } from '@/lib/utils';
import { JSX, PropsWithChildren } from 'react';

export const StatsIcon = ({
    children,
    className,
    ...props
}: PropsWithChildren<JSX.IntrinsicElements['div']>) => {
    return (
        <div
            className={cn(
                className,
                'inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200',
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const StatsLabel = ({
    children,
    className,
    ...props
}: PropsWithChildren<JSX.IntrinsicElements['div']>) => {
    return (
        <div
            className={cn(
                className,
                'text-sm font-semibold text-slate-900 mb-1',
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const StatsDescription = ({
    children,
    className,
    ...props
}: PropsWithChildren<JSX.IntrinsicElements['div']>) => {
    return (
        <div className={cn(className, 'text-xs text-slate-500')} {...props}>
            {children}
        </div>
    );
};

export const StatsValue = ({
    children,
    className,
    ...props
}: PropsWithChildren<JSX.IntrinsicElements['div']>) => {
    return (
        <div
            className={cn(className, 'text-3xl font-bold text-slate-900 mb-2')}
            {...props}
        >
            {children}
        </div>
    );
};

export const Stats = ({
    children,
    className,
    ...props
}: PropsWithChildren<JSX.IntrinsicElements['div']>) => {
    return (
        <div
            className={cn(
                className,
                'mx-auto w-full text-center p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50',
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const StatsGrid = ({ children }: PropsWithChildren) => {
    return (
        <section className="py-16 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {children}
                </div>
            </div>
        </section>
    );
};
