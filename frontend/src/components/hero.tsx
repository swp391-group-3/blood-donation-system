import { PropsWithChildren } from 'react';

export const HeroSummary = ({
    color,
    children,
}: PropsWithChildren<{ color: string }>) => {
    return (
        <div
            className={`inline-flex items-center px-4 py-2 bg-${color}-50 text-${color}-700 rounded-full text-sm font-medium mb-6`}
        >
            {children}
        </div>
    );
};

export const HeroKeyword = ({
    color,
    children,
}: PropsWithChildren<{ color: string }>) => {
    return <span className={`block text-${color}-600`}>{children}</span>;
};

export const HeroTitle = ({ children }: PropsWithChildren) => {
    return (
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            {children}
        </h1>
    );
};

export const HeroDescription = ({ children }: PropsWithChildren) => {
    return (
        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            {children}
        </p>
    );
};

export const Hero = ({ children }: PropsWithChildren) => {
    return (
        <section className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center max-w-4xl mx-auto">{children}</div>
            </div>
        </section>
    );
};
