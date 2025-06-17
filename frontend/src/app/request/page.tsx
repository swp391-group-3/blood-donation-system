'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
import { Stats } from '@/components/stats';
import { useBloodRequest } from '@/hooks/blood-request/useBloodRequest';
import { toast } from 'sonner';

const schema = z.object({
    searchTerm: z.string().optional().default(''),
    priority: z.string().default('all'),
    bloodGroup: z.string().default('all'),
});

export type SearchFormValues = z.infer<typeof schema>;

export default function BloodRequestPage() {
    const { data: bloodRequests, isPending, error } = useBloodRequest();
    const [statusFilter, setStatusFilter] = useState('active');
    const [searchField, setSearchField] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [bloodGroupFilter, setBloodGroupFilter] = useState('all');
    const [filteredRequests, setFilteredRequests] = useState(mockRequests);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            searchTerm: '',
            priority: 'all',
            bloodGroup: 'all',
        },
    });

    const { watch } = form;

    const searchTerm = watch('searchTerm');
    const priority = watch('priority');
    const bloodGroup = watch('bloodGroup');

    function handleSearch(data: SearchFormValues) {
        // Come in future
    }

    const getPriorityConfig = (priority: string) => {
        switch (priority) {
            case 'high':
                return {
                    color: 'bg-red-500',
                    textColor: 'text-red-700',
                    bgColor: 'bg-red-50',
                    icon: AlertTriangle,
                    label: 'High Priority',
                };
            case 'medium':
                return {
                    color: 'bg-yellow-500',
                    textColor: 'text-yellow-700',
                    bgColor: 'bg-yellow-50',
                    icon: Clock,
                    label: 'Medium Priority',
                };
            case 'low':
                return {
                    color: 'bg-green-500',
                    textColor: 'text-green-700',
                    bgColor: 'bg-green-50',
                    icon: Heart,
                    label: 'Low Priority',
                };
            default:
                return {
                    color: 'bg-gray-500',
                    textColor: 'text-gray-700',
                    bgColor: 'bg-gray-50',
                    icon: Heart,
                    label: 'Normal',
                };
        }
    };

    type BloodType = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';
    const compatible: Record<BloodType, BloodType[]> = {
        'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        'O+': ['O+', 'A+', 'B+', 'AB+'],
        'A-': ['A-', 'A+', 'AB-', 'AB+'],
        'A+': ['A+', 'AB+'],
        'B-': ['B-', 'B+', 'AB-', 'AB+'],
        'B+': ['B+', 'AB+'],
        'AB-': ['AB-', 'AB+'],
        'AB+': ['AB+'],
    };

    const userBloodGroup: BloodType = 'A-';
    function isCompatibleBloodGroup(requestBloodGroup: string): boolean {
        if (requestBloodGroup === 'All') return true;
        return compatible[userBloodGroup].includes(
            requestBloodGroup as BloodType,
        );
    }

    const getRecommendedRequests = () => {
        return mockRequests.filter(
            (request) =>
                isCompatibleBloodGroup(request.bloodGroup) ||
                request.priority === 'high',
        );
    };

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
                        <Stats
                            label="Blood Requests"
                            value={bloodRequests.length}
                            icon={Droplets}
                            description="Number of blood request"
                            fg="text-rose-600"
                            bg="bg-rose-50"
                        />
                        <Stats
                            label="Urgent Requests"
                            value={
                                bloodRequests.filter(
                                    (request) => request.priority === 'high',
                                ).length
                            }
                            icon={Droplet}
                            description="Number of urgent blood request"
                            fg="text-rose-600"
                            bg="bg-rose-50"
                        />
                        <Stats
                            label="Donors Needed"
                            value="10"
                            icon={User}
                            description="Number of donors need across all request"
                            fg="text-blue-600"
                            bg="bg-blue-50"
                        />
                        <Stats
                            label="Recommended Requests"
                            value="0"
                            icon={UserSearch}
                            description="Number of recommended request for you"
                            fg="text-emerald-600"
                            bg="bg-emerald-50"
                        />
                    </div>
                </div>
            </section>

            <Tabs
                value={statusFilter}
                onValueChange={setStatusFilter}
                className="space-y-6"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="active">Active Requests</TabsTrigger>
                    <TabsTrigger value="recommended">
                        Recommended for You
                    </TabsTrigger>
                </TabsList>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSearch)}
                        className="flex flex-col lg:flex-row gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="searchTerm"
                            render={({ field }) => (
                                <FormItem className="relative flex-1">
                                    <FormControl>
                                        <div>
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                                            <Input
                                                placeholder="Search requests by tittle"
                                                className="pl-10 h-9"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3">
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-[180px] h-12">
                                                    <Filter className="mr-2 h-4 w-4" />
                                                    <SelectValue placeholder="Priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Priorities
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    High Priorities
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    Medium Priorities
                                                </SelectItem>
                                                <SelectItem value="low">
                                                    Low Priority
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bloodGroup"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-[200px] h-12">
                                                    <Droplet className="mr-2 h-4 w-4" />
                                                    <SelectValue placeholder="Blood Group" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Blood Groups
                                                </SelectItem>
                                                <SelectItem value="A+">
                                                    A+
                                                </SelectItem>
                                                <SelectItem value="A-">
                                                    A-
                                                </SelectItem>
                                                <SelectItem value="B+">
                                                    B+
                                                </SelectItem>
                                                <SelectItem value="B-">
                                                    B-
                                                </SelectItem>
                                                <SelectItem value="AB+">
                                                    AB+
                                                </SelectItem>
                                                <SelectItem value="AB-">
                                                    AB-
                                                </SelectItem>
                                                <SelectItem value="O+">
                                                    O+
                                                </SelectItem>
                                                <SelectItem value="O-">
                                                    O-
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>

                <TabsContent value="active" className="space-y-6">
                    {filteredRequests.length > 0 ? (
                        <div className="grid gap-6">
                            {filteredRequests.map((request) => {
                                const priorityConfig = getPriorityConfig(
                                    request.priority,
                                );
                                const PriorityIcon = priorityConfig.icon;
                                const isCompatible = isCompatibleBloodGroup(
                                    request.bloodGroup,
                                );
                                const progressPercentage =
                                    (request.currentPeople /
                                        request.maxPeople) *
                                    100;
                                return (
                                    <Card
                                        key={request.id}
                                        className={`transition-all duration-200 hover:shadow-lg ${
                                            isCompatible
                                                ? 'ring-1 ring-green-200 bg-green-50'
                                                : 'ring-1 ring-zinc-200 bg-zinc-50'
                                        }`}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                <div className="space-y-4 flex-1">
                                                    <div className="flex items-start gap-3">
                                                        <div
                                                            className={`p-2 rounded-lg ${priorityConfig.bgColor}`}
                                                        >
                                                            <PriorityIcon
                                                                className={`h-5 w-5 ${priorityConfig.textColor}`}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h3 className="text-xl font-semibold text-zinc-900">
                                                                    {
                                                                        request.title
                                                                    }
                                                                </h3>
                                                                <Badge
                                                                    className={
                                                                        priorityConfig.color
                                                                    }
                                                                >
                                                                    {
                                                                        priorityConfig.label
                                                                    }
                                                                </Badge>
                                                                {isCompatible ? (
                                                                    <Badge className="bg-green-500">
                                                                        Compatible
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge className="bg-zinc-500">
                                                                        Not
                                                                        Compatible
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-zinc-600 mb-3">
                                                                {
                                                                    request.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <Droplet className="h-4 w-4 text-red-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        request.bloodGroup
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-zinc-500">
                                                                    Blood Type
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-blue-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        request.estimatedTimeLeft
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Time Left
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-purple-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        request.currentPeople
                                                                    }{' '}
                                                                    /{' '}
                                                                    {
                                                                        request.maxPeople
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Donors
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium">
                                                                Progress
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {Math.round(
                                                                    progressPercentage,
                                                                )}
                                                                % filled
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={
                                                                progressPercentage
                                                            }
                                                            className={`
                                                                h-2
                                                                [&>div]:transition-all
                                                                [&>div]:duration-300
                                                                ${
                                                                    progressPercentage >=
                                                                    80
                                                                        ? '[&>div]:bg-green-600'
                                                                        : progressPercentage >=
                                                                            50
                                                                          ? '[&>div]:bg-yellow-600'
                                                                          : '[&>div]:bg-red-600'
                                                                }
                                                            `}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-3 lg:w-48">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/member/request/${request.id}`}
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View Details
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        className="w-full bg-green-600 text-white hover:bg-green-700"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/member/request/${request.id}`}
                                                        >
                                                            Apply Now
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState
                            icon={<Droplet className="h-12 w-12" />}
                            title="No requests found"
                            description="No blood donation requests match your current filters. Try adjusting your search criteria."
                            action={{
                                label: 'Clear Filters',
                                onClick: () => {
                                    setSearchField('');
                                    setPriorityFilter('all');
                                    setBloodGroupFilter('all');
                                },
                            }}
                        />
                    )}
                </TabsContent>

                <TabsContent value="recommended" className="space-y-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Heart className="h-5 w-5 text-red-600" />
                            <h3 className="font-medium text-zinc-800">
                                Personalized Recommendations
                            </h3>
                        </div>
                        <p className="text-sm text-zinc-700">
                            These requests are recommended based on your blood
                            type ({userBloodGroup}) and urgent needs.
                        </p>
                    </div>

                    {getRecommendedRequests().length > 0 ? (
                        <div className="grid gap-6">
                            {getRecommendedRequests().map((request) => {
                                const priorityConfig = getPriorityConfig(
                                    request.priority,
                                );
                                const PriorityIcon = priorityConfig.icon;
                                const isCompatible = isCompatibleBloodGroup(
                                    request.bloodGroup,
                                );
                                const progressPercentage =
                                    (request.currentPeople /
                                        request.maxPeople) *
                                    100;
                                return (
                                    <Card
                                        key={request.id}
                                        className="ring-1 ring-green-200 bg-green-50 hover:shadow-lg transition-all duration-200"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                <div className="space-y-4 flex-1">
                                                    <div className="flex items-start gap-3">
                                                        <div
                                                            className={`p-2 rounded-lg ${priorityConfig.bgColor}`}
                                                        >
                                                            <PriorityIcon
                                                                className={`h-5 w-5 ${priorityConfig.textColor}`}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h3 className="text-xl font-semibold text-zinc-900">
                                                                    {
                                                                        request.title
                                                                    }
                                                                </h3>
                                                                <Badge
                                                                    className={
                                                                        priorityConfig.color
                                                                    }
                                                                >
                                                                    {
                                                                        priorityConfig.label
                                                                    }
                                                                </Badge>
                                                                {isCompatible && (
                                                                    <Badge className="bg-green-500">
                                                                        Compatible
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            <p className="text-zinc-600 mb-3">
                                                                {
                                                                    request.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <Droplet className="h-4 w-4 text-red-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        request.bloodGroup
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-zinc-500">
                                                                    Blood Type
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-blue-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        request.estimatedTimeLeft
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Time Left
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-purple-500" />
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        request.currentPeople
                                                                    }{' '}
                                                                    /{' '}
                                                                    {
                                                                        request.maxPeople
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Donors
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium">
                                                                Progress
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {Math.round(
                                                                    progressPercentage,
                                                                )}
                                                                % filled
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={
                                                                progressPercentage
                                                            }
                                                            className={`
                                                                h-2
                                                                [&>div]:transition-all
                                                                [&>div]:duration-300
                                                                ${
                                                                    progressPercentage >=
                                                                    80
                                                                        ? '[&>div]:bg-green-600'
                                                                        : progressPercentage >=
                                                                            50
                                                                          ? '[&>div]:bg-yellow-600'
                                                                          : '[&>div]:bg-red-600'
                                                                }
                                                            `}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-3 lg:w-48">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/member/request/${request.id}`}
                                                        >
                                                            View Details
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        className="w-full bg-green-600 text-white"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/member/request/${request.id}`}
                                                        >
                                                            Apply Now
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState
                            icon={<Heart className="h-12 w-12" />}
                            title="No recommendations available"
                            description="We don't have any personalized recommendations for you right now. Check back later or browse all active requests."
                            action={{
                                label: 'Browse All Requests',
                                onClick: () => setStatusFilter('active'),
                            }}
                        />
                    )}
                </TabsContent>
            </Tabs>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-red-600 mb-2">
                            {
                                mockRequests.filter(
                                    (request) => request.priority === 'high',
                                ).length
                            }
                        </div>
                        <p className="text-sm text-zinc-600">Urgent Requests</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                            {getRecommendedRequests().length}
                        </div>
                        <p className="text-sm text-zinc-600">
                            Recommended for You
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                            {mockRequests.reduce(
                                (sum, r) =>
                                    sum + (r.maxPeople - r.currentPeople),
                                0,
                            )}
                        </div>
                        <p className="text-sm text-zinc-600">
                            Donors Still Needed
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
