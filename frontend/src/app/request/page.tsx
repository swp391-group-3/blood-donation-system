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
    Heart,
    Droplets,
    User,
    UserSearch,
} from 'lucide-react';
import {
    Stats,
    StatsDescription,
    StatsGrid,
    StatsIcon,
    StatsLabel,
    StatsValue,
} from '@/components/stats';
import { useBloodRequestList } from '@/hooks/use-blood-request-list';
import { toast } from 'sonner';
import {
    BloodRequest,
    BloodRequestStats,
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
import {
    Hero,
    HeroDescription,
    HeroKeyword,
    HeroSummary,
    HeroTitle,
} from '@/components/hero';
import { CardGrid } from '@/components/card-grid';
import { RequestCard } from '@/components/request-card';
import { useBloodRequestStats } from '@/hooks/use-blood-request-stats';
import { PaginationState } from '@tanstack/react-table';

// const parseStats = (raw: BloodRequestStats): StatsProps[] => {
//     return [
//         {
//             label: 'Urgent Requests',
//             value: bloodRequests.filter(
//                 (request) => request.priority === 'high',
//             ).length,
//             icon: Droplet,
//             description: 'Number of urgent blood request',
//             color: 'rose',
//         },
//         {
//             label: 'Donors Needed',
//             value: bloodRequests.reduce(
//                 (count, request) =>
//                     count + (request.max_people - request.current_people),
//                 0,
//             ),
//             icon: User,
//             description: 'Number of donors need across all request',
//             color: 'blue',
//         },
//         {
//             label: 'Recommended Requests',
//             value: '0',
//             icon: UserSearch,
//             description: 'Number of recommended request for you',
//             color: 'emerald',
//         },
//     ];
// };

export default function BloodRequestPage() {
    const [priority, setPriority] = useState<Priority | undefined>();
    const [bloodGroup, setBloodGroup] = useState<BloodGroup | undefined>();
    const [search, setSearch] = useState<string | undefined>();
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const {
        data: request,
        isPending,
        error,
    } = useBloodRequestList({
        query: search,
        blood_group: bloodGroup,
        priority,
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
    });
    const { data: stats } = useBloodRequestStats();

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

            {stats && (
                <StatsGrid>
                    <Stats>
                        <StatsIcon className="bg-rose-50 text-rose-600">
                            <Droplets />
                        </StatsIcon>
                        <StatsValue>{stats.total_requests}</StatsValue>
                        <StatsLabel>Blood Requests</StatsLabel>
                        <StatsDescription>
                            Number of blood request
                        </StatsDescription>
                    </Stats>
                    <Stats>
                        <StatsIcon className="bg-rose-50 text-rose-600">
                            <Droplet />
                        </StatsIcon>
                        <StatsValue>{stats.urgent_requests}</StatsValue>
                        <StatsLabel>Urgent Requests</StatsLabel>
                        <StatsDescription>
                            Number of urgent blood request
                        </StatsDescription>
                    </Stats>
                    <Stats>
                        <StatsIcon className="bg-blue-50 text-blue-600">
                            <User />
                        </StatsIcon>
                        <StatsValue>{stats.donors_needed}</StatsValue>
                        <StatsLabel>Donors Needed</StatsLabel>
                        <StatsDescription>
                            Number of donors need across all request
                        </StatsDescription>
                    </Stats>
                    <Stats>
                        <StatsIcon className="bg-emerald-50 text-emerald-600">
                            <UserSearch />
                        </StatsIcon>
                        <StatsValue>{stats.total_requests}</StatsValue>
                        <StatsLabel>Recommended Requests</StatsLabel>
                        <StatsDescription>
                            Number of recommended request for you
                        </StatsDescription>
                    </Stats>
                </StatsGrid>
            )}

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
                {request && (
                    <CardGrid className="grid md:grid-cols-2 gap-10">
                        {request.data.map((request, index) => (
                            <RequestCard key={index} {...request} />
                        ))}
                    </CardGrid>
                )}
            </div>
        </div>
    );
}
