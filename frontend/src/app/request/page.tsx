'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Droplet,
    Search,
    Filter,
    Calendar,
    Users,
    Clock,
    AlertTriangle,
    Heart,
    Eye,
    Droplets,
    User,
    UserSearch,
} from 'lucide-react';
import Link from 'next/link';
import { mockRequests } from '../../../constants/sample-data';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Stats, Props as StatsProps } from '@/components/stats';
import { useBloodRequest } from '@/hooks/blood-request/useBloodRequest';
import { toast } from 'sonner';
import { BloodRequest, Priority } from '@/lib/api/dto/blood-request';
import { useMemo } from 'react';

const getStats = (bloodRequests: BloodRequest[]): StatsProps[] => {
    return [
        {
            label: 'Blood Requests',
            value: bloodRequests.length,
            icon: Droplets,
            description: 'Number of blood request',
            fg: 'text-rose-600',
            bg: 'bg-rose-50',
        },
        {
            label: 'Urgent Requests',
            value: bloodRequests.filter(
                (request) => request.priority === 'high',
            ).length,
            icon: Droplet,
            description: 'Number of urgent blood request',
            fg: 'text-rose-600',
            bg: 'bg-rose-50',
        },
        {
            label: 'Donors Needed',
            value: bloodRequests.reduce(
                (count, request) =>
                    count + (request.max_people - request.current_people),
                0,
            ),
            icon: User,
            description: 'Number of donors need across all request',
            fg: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Recommended Requests',
            value: '0',
            icon: UserSearch,
            description: 'Number of recommended request for you',
            fg: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
    ];
};

export default function BloodRequestPage() {
    const { data: bloodRequests, isPending, error } = useBloodRequest();
    const stats = useMemo(
        () => (bloodRequests ? getStats(bloodRequests) : undefined),
        [bloodRequests],
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
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 bg-rose-50 text-rose-700 rounded-full text-sm font-medium mb-6">
                            <Heart className="h-4 w-4 mr-2" />
                            Save Lives Today
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                            Blood Donation
                            <span className="block text-rose-600">
                                Requests
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                            Find and respond to blood donation opportunities in
                            your community
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats!.map((entry, index) => (
                            <Stats key={index} {...entry} />
                        ))}
                    </div>
                </div>
            </section>

            <Tabs className="space-y-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <TabsList className="grid w-full sm:w-auto grid-cols-2 bg-slate-100 p-1 rounded-xl">
                            <TabsTrigger
                                value="active"
                                className="rounded-lg font-medium"
                            >
                                Active Requests
                            </TabsTrigger>
                            <TabsTrigger
                                value="recommended"
                                className="rounded-lg font-medium"
                            >
                                Recommended for You
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:flex-initial">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input
                                placeholder="Search by title..."
                                className="pl-11 w-full lg:w-80 border-slate-200 focus:border-rose-300 focus:ring-rose-200"
                            />
                        </div>
                        <Select>
                            <SelectTrigger className="w-full sm:w-40 border-slate-200">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Priority
                                </SelectItem>
                                <SelectItem value="critical">
                                    Critical
                                </SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-full sm:w-40 border-slate-200 rounded-xl">
                                <Droplets className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Blood Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="o-">O-</SelectItem>
                                <SelectItem value="o+">O+</SelectItem>
                                <SelectItem value="a-">A-</SelectItem>
                                <SelectItem value="a+">A+</SelectItem>
                                <SelectItem value="b-">B-</SelectItem>
                                <SelectItem value="b+">B+</SelectItem>
                                <SelectItem value="ab-">AB-</SelectItem>
                                <SelectItem value="ab+">AB+</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}
