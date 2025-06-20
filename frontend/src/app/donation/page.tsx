'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Filter, Droplets, Calendar, Activity, Award } from 'lucide-react';
import { Stats, StatsGrid, Props as StatsProps } from '@/components/stats';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { capitalCase } from 'change-case';
import {
    Hero,
    HeroDescription,
    HeroKeyword,
    HeroSummary,
    HeroTitle,
} from '@/components/hero';
import { CardGrid } from '@/components/card-grid';
import { Donation, DonationType, donationTypes } from '@/lib/api/dto/donation';
import { useCurrentAccountDonation } from '@/hooks/use-current-account-donation';
import {
    differenceInCalendarMonths,
    differenceInCalendarQuarters,
    differenceInCalendarYears,
} from 'date-fns';
import { DonationCard } from '@/components/donation-card';

const getStats = (donations: Donation[]): StatsProps[] => {
    return [
        {
            label: 'Total Donations',
            value: donations.length.toString(),
            icon: Droplets,
            description: 'All donations',
            color: 'rose',
        },
        {
            label: 'Total Amount',
            value: `${donations.reduce((sum, donation) => sum + donation.amount, 0)}ml`,
            icon: Activity,
            description: 'Volume donated',
            color: 'blue',
        },
        {
            label: 'This Month',
            value: donations
                .filter(
                    (d) =>
                        d.created_at >
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                )
                .length.toString(),
            icon: Calendar,
            description: 'Recent donations',
            color: 'emerald',
        },
        {
            label: 'Donation Types',
            value: new Set(donations.map((d) => d.type)).size.toString(),
            icon: Award,
            description: 'Different types',
            color: 'purple',
        },
    ];
};

export default function DonationPage() {
    const { data: donations, isPending, error } = useCurrentAccountDonation();
    const stats = useMemo(
        () => (donations ? getStats(donations) : undefined),
        [donations],
    );
    const [type, setType] = useState<DonationType | 'all'>('all');
    const [period, setPeriod] = useState<'month' | 'quarter' | 'year' | 'all'>(
        'all',
    );
    const filteredDonations = useMemo(
        () =>
            donations
                ?.filter((donation) => type === 'all' || donation.type === type)
                .filter((donation) => {
                    switch (period) {
                        case 'all':
                            return true;
                        case 'month':
                            return (
                                differenceInCalendarMonths(
                                    new Date(),
                                    new Date(donation.created_at),
                                ) <= 1
                            );
                        case 'quarter':
                            return (
                                differenceInCalendarQuarters(
                                    new Date(),
                                    new Date(donation.created_at),
                                ) <= 1
                            );
                        case 'year':
                            return (
                                differenceInCalendarYears(
                                    new Date(),
                                    new Date(donation.created_at),
                                ) <= 1
                            );
                    }
                }),
        [donations, type, period],
    );

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error('Failed to fetch blood request list');
        return <div></div>;
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            <Hero>
                <HeroSummary color="rose">
                    <Droplets className="h-4 w-4 mr-2" />
                    Donation History
                </HeroSummary>
                <HeroTitle>
                    Your Blood
                    <HeroKeyword color="rose">Donations</HeroKeyword>
                </HeroTitle>
                <HeroDescription>
                    Track your donation history and impact
                </HeroDescription>
            </Hero>

            <StatsGrid>
                {stats!.map((entry, index) => (
                    <Stats key={index} {...entry} />
                ))}
            </StatsGrid>

            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                    <div className="relative flex-1"></div>
                    <Select
                        value={type}
                        onValueChange={(value: DonationType | 'all') =>
                            setType(value)
                        }
                    >
                        <SelectTrigger className="w-full sm:w-40 border-slate-200 rounded">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {donationTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {capitalCase(type)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={period}
                        onValueChange={(
                            value: 'month' | 'quarter' | 'year' | 'all',
                        ) => setPeriod(value)}
                    >
                        <SelectTrigger className="w-full sm:w-40 h-11 border-slate-200 rounded">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">
                                Last 3 Months
                            </SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <CardGrid className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredDonations!.map((request, index) => (
                        <DonationCard key={index} {...request} />
                    ))}
                </CardGrid>
            </div>
        </div>
    );
}
