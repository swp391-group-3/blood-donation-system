'use client';

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
    Droplets,
    User,
    UserSearch,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Stats, Props as StatsProps } from '@/components/stats';
import { useBloodRequest } from '@/hooks/use-blood-request';
import { toast } from 'sonner';
import {
    BloodRequest,
    priorities,
    Priority,
} from '@/lib/api/dto/blood-request';
import { useMemo, useState } from 'react';
import { capitalCase } from 'change-case';
import {
    BloodGroup,
    bloodGroups,
    bloodGroupLabels,
} from '@/lib/api/dto/blood-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';
import {
    Hero,
    HeroDescription,
    HeroKeyword,
    HeroSummary,
    HeroTitle,
} from '@/components/hero';

const priorityConfig = {
    high: {
        color: 'bg-rose-500',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        textColor: 'text-rose-700',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: AlertTriangle,
        ringColor: 'ring-rose-500/20',
    },
    medium: {
        color: 'bg-amber-500',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-700',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock,
        ringColor: 'ring-amber-500/20',
    },
    low: {
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-700',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Calendar,
        ringColor: 'ring-blue-500/20',
    },
};

const calculateProgress = (current: number, max: number): number => {
    return Math.round((current / max) * 100);
};

const getTimeRemaining = (endTime: Date): string => {
    return formatDistanceToNow(endTime, { addSuffix: false });
};

const BloodRequestCard = (request: BloodRequest) => {
    const config = priorityConfig[request.priority];
    const Icon = config.icon;
    const progress = calculateProgress(
        request.current_people,
        request.max_people,
    );
    const timeRemaining = getTimeRemaining(request.end_time);

    return (
        <Card
            key={request.id}
            className={cn(
                'group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-slate-200 rounded-2xl overflow-hidden h-fit',
                config.ringColor,
            )}
        >
            <CardHeader className="p-6">
                <div className="flex items-start gap-4 mb-4">
                    <div
                        className={`p-3 rounded-xl ${config.color} shadow-lg ${config.ringColor} ring-4`}
                    >
                        <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="flex items-center gap-5 text-lg font-bold text-slate-900 leading-tight mb-3">
                            {request.title}
                            <Badge
                                className={`${config.badgeColor} border text-xs font-semibold px-2 py-1`}
                            >
                                {capitalCase(request.priority)}
                            </Badge>
                        </CardTitle>
                    </div>
                </div>
                <div>
                    <div className="text-xs font-medium text-slate-500 mb-2">
                        Blood Types Needed
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {request.blood_groups.map((type, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="bg-rose-50 text-rose-700 border-rose-200 text-xs font-semibold px-2 py-1"
                            >
                                {bloodGroupLabels[type]}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <div>
                            <div className="font-semibold text-slate-900 text-sm">
                                {timeRemaining}
                            </div>
                            <div className="text-xs text-slate-500">
                                Time Left
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <Users className="h-4 w-4 text-emerald-600" />
                        <div>
                            <div className="font-semibold text-slate-900 text-sm">
                                {request.current_people}/{request.max_people}
                            </div>
                            <div className="text-xs text-slate-500">Donors</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <div>
                            <div className="font-semibold text-slate-900 text-sm">
                                {new Date(
                                    request.start_time,
                                ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-slate-500">
                                Start Date
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-amber-600" />
                        <div>
                            <div className="font-semibold text-slate-900 text-sm">
                                {new Date(
                                    request.end_time,
                                ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-slate-500">
                                End Date
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-700">
                            Progress
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                            {progress}%
                        </span>
                    </div>
                    <Progress
                        value={progress}
                        className={`h-2 bg-slate-200 rounded-full ${
                            request.priority === 'high'
                                ? '[&>div]:bg-rose-500'
                                : request.priority === 'medium'
                                  ? '[&>div]:bg-amber-500'
                                  : '[&>div]:bg-blue-500'
                        }`}
                    />
                    <div className="text-xs text-slate-500 font-medium">
                        {request.max_people - request.current_people} more
                        donors needed
                    </div>
                </div>

                <div className="space-y-2">
                    <Button className="w-full h-10 font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25 transition-all duration-200">
                        Apply Now
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-9 border-slate-200 hover:bg-slate-50 rounded-xl"
                    >
                        View Details
                        <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

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
    const [priority, setPriority] = useState<Priority | undefined>();
    const [bloodGroup, setBloodGroup] = useState<BloodGroup | undefined>();
    const [search, setSearch] = useState<string | undefined>();
    const filteredRequests = useMemo(
        () =>
            bloodRequests
                ?.filter(
                    (request) => !priority || request.priority === priority,
                )
                .filter(
                    (request) =>
                        !bloodGroup ||
                        request.blood_groups.indexOf(bloodGroup) !== -1,
                )
                .filter((request) => !search || request.title.includes(search)),
        [bloodRequests, priority, bloodGroup, search],
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
                    <Heart className="h-4 w-4 mr-2" />
                    Save Lives Today
                </HeroSummary>
                <HeroTitle>
                    Blood Donation
                    <HeroKeyword color="rose">Requests</HeroKeyword>
                </HeroTitle>
                <HeroDescription>
                    Find and respond to blood donation opportunities in your
                    community
                </HeroDescription>
            </Hero>

            <section className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats!.map((entry, index) => (
                            <Stats key={index} {...entry} />
                        ))}
                    </div>
                </div>
            </section>
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search requests..."
                            className="pl-11 border-slate-200 focus:border-rose-300 focus:ring-rose-200 rounded-xl"
                        />
                    </div>
                    <Select
                        value={priority}
                        onValueChange={(value: Priority) => setPriority(value)}
                    >
                        <SelectTrigger
                            onReset={() => setPriority(undefined)}
                            value={priority}
                            className="w-fit border-slate-200"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            {priorities.map((priority) => (
                                <SelectItem key={priority} value={priority}>
                                    {capitalCase(priority)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={bloodGroup}
                        onValueChange={(value: BloodGroup) =>
                            setBloodGroup(value)
                        }
                    >
                        <SelectTrigger className="w-fit border-slate-200">
                            <Droplet className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Blood Group" />
                        </SelectTrigger>
                        <SelectContent>
                            {bloodGroups.map((group) => (
                                <SelectItem key={group} value={group}>
                                    {bloodGroupLabels[group]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div
                    className={cn(
                        'grid gap-10',
                        !filteredRequests || filteredRequests.length === 0
                            ? ''
                            : 'md:grid-cols-2',
                    )}
                >
                    {!filteredRequests || filteredRequests.length === 0 ? (
                        <EmptyState
                            className="mx-auto"
                            title="No Results Found"
                            description="Try adjusting your search filters."
                            icons={[Search]}
                        />
                    ) : (
                        filteredRequests.map((request, index) => (
                            <BloodRequestCard key={index} {...request} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
