'use client';

import { Shield } from 'lucide-react';
import { useCurrentAccountHealth } from '@/hooks/use-current-account-health';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import {
    Hero,
    HeroDescription,
    HeroKeyword,
    HeroSummary,
    HeroTitle,
} from '@/components/hero';
import { HealthOverviewCard } from '@/components/health-overview-card';
import { CardGrid } from '@/components/card-grid';
import { HealthCard } from '@/components/health-card';

export default function HealthPage() {
    const { data: healths, isPending, error } = useCurrentAccountHealth();

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error('Login to use this feature');
        redirect('/auth/login');
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Hero>
                <HeroSummary color="emerald">
                    <Shield className="h-4 w-4 mr-2" />
                    Health Monitoring
                </HeroSummary>
                <HeroTitle>
                    Your Health
                    <HeroKeyword color="emerald">Dashboard</HeroKeyword>
                </HeroTitle>
                <HeroDescription>
                    Monitor your health status and donation eligibility
                </HeroDescription>
            </Hero>
            <div className="mb-8">
                <HealthOverviewCard healths={healths} />
            </div>

            <div>
                <div className="items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">
                        Health Records
                    </h2>
                    <p className="text-slate-600">
                        Your complete health history timeline
                    </p>
                </div>
            </div>

            <CardGrid>
                {healths.map((health) => (
                    <HealthCard key={health.id} {...health} />
                ))}
            </CardGrid>
        </div>
    );
}
