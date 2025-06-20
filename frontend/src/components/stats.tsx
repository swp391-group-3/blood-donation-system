import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface Props {
    icon: LucideIcon;
    bg: string;
    fg: string;
    label: string;
    description: string;
    value: string | number;
}

export const Stats = (props: Props) => {
    return (
        <div className="mx-auto w-full text-center p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50">
            <div
                className={cn(
                    'inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200',
                    props.bg,
                    props.fg,
                )}
            >
                <props.icon />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
                {props.value}
            </div>
            <div className="text-sm font-semibold text-slate-900 mb-1">
                {props.label}
            </div>
            <div className="text-xs text-slate-500">{props.description}</div>
        </div>
    );
};
