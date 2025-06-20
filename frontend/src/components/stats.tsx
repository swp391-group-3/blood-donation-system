import { LucideIcon } from 'lucide-react';
import { PropsWithChildren } from 'react';

export interface Props {
    icon: LucideIcon;
    color: string;
    label: string;
    description: string;
    value: string | number;
}

export const Stats = ({
    icon: Icon,
    color,
    label,
    description,
    value,
}: Props) => {
    return (
        <div className="mx-auto w-full text-center p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50">
            <div
                className={`bg-${color}-50 text-${color}-600 inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200`}
            >
                <Icon />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
                {value}
            </div>
            <div className="text-sm font-semibold text-slate-900 mb-1">
                {label}
            </div>
            <div className="text-xs text-slate-500">{description}</div>
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
