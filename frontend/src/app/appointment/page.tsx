'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Search,
    Calendar,
    Clock,
    Plus,
    Filter,
    Eye,
    CheckCircle,
    Droplet,
    ChartLine,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    summaryStats,
    upcomingAppointments,
    completedAppointments,
} from '../../../constants/sample-data';
import Link from 'next/link';

const schema = z.object({
    searchTerm: z.string().optional().default(''),
    status: z.string().default('all'),
    priority: z.string().default('all'),
    bloodGroup: z.string().default('all'),
});

export type SearchFormValues = z.infer<typeof schema>;

export default function AppointmentsPage() {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            searchTerm: '',
            status: 'all',
            priority: 'all',
            bloodGroup: 'all',
        },
    });

    function handleSearch(data: SearchFormValues) {
        console.log(data);
    }

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high priority':
                return 'destructive';
            case 'medium priority':
                return 'default';
            default:
                return 'secondary';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'completed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Appointments</h1>
                        <p className="text-muted-foreground">
                            Manage your blood donation appointments and track
                            your donation history
                        </p>
                    </div>
                    <Button asChild className="bg-red-600 hover:bg-red-700">
                        <Link href="/member/request">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Appointment
                        </Link>
                    </Button>
                </div>

                <Tabs defaultValue="upcoming" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="upcoming"
                            className="flex items-center gap-2"
                        >
                            <Calendar className="h-4 w-4" />
                            Upcoming ({upcomingAppointments.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="completed"
                            className="flex items-center gap-2"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Completed ({completedAppointments.length})
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
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-[180px] h-12">
                                                        <ChartLine className="mr-2 h-4 w-4" />
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        All Status
                                                    </SelectItem>
                                                    <SelectItem value="confirm">
                                                        Confirm
                                                    </SelectItem>
                                                    <SelectItem value="pending">
                                                        Pending
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
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

                    <TabsContent value="upcoming" className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                            <Card
                                key={appointment.id}
                                className="mb-4 border-l-4 border-l-red-500"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold">
                                            {appointment.title}
                                        </h3>
                                        <Badge
                                            className={getStatusColor(
                                                appointment.status,
                                            )}
                                        >
                                            {appointment.status}
                                        </Badge>
                                        {appointment.priority && (
                                            <Badge
                                                variant={getPriorityColor(
                                                    appointment.priority,
                                                )}
                                                className="text-xs"
                                            >
                                                {appointment.priority}
                                            </Badge>
                                        )}
                                        {appointment.timeUntil && (
                                            <span className="text-sm text-blue-600 font-medium">
                                                {appointment.timeUntil}
                                            </span>
                                        )}
                                        <div className="flex gap-2 ml-auto">
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View Details
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Reschedule
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                                <Droplet className="h-4 w-4 text-red-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Blood Group
                                                </p>
                                                <p className="text-sm font-normal">
                                                    {appointment.bloodGroup}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                            <Calendar className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Date
                                                </p>
                                                <p className="text-sm font-normal">
                                                    {appointment.date}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                            <Clock className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Time
                                                </p>
                                                <p className="text-sm font-normal">
                                                    {appointment.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 p-4 bg-zinc-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                Estimated Duration
                                            </p>
                                            <p className="text-sm text-gray-800">
                                                {appointment.duration}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                Preparation Notes
                                            </p>
                                            <p className="text-sm text-gray-800">
                                                {appointment.notes}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-4">
                        {completedAppointments.map((appointment) => (
                            <Card
                                key={appointment.id}
                                className="mb-4 border-l-4 border-l-red-500"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold">
                                            {appointment.title}
                                        </h3>
                                        <Badge
                                            className={getStatusColor(
                                                appointment.status,
                                            )}
                                        >
                                            {appointment.status}
                                        </Badge>
                                        {appointment.priority && (
                                            <Badge
                                                variant={getPriorityColor(
                                                    appointment.priority,
                                                )}
                                                className="text-xs"
                                            >
                                                {appointment.priority}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                                <Droplet className="h-4 w-4 text-red-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Blood Group
                                                </p>
                                                <p className="text-sm font-normal">
                                                    {appointment.bloodGroup}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                            <Calendar className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Date
                                                </p>
                                                <p className="text-sm font-normal">
                                                    {appointment.date}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                            <Clock className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Time
                                                </p>
                                                <p className="text-sm font-normal">
                                                    {appointment.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 p-4 bg-zinc-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                Estimated Duration
                                            </p>
                                            <p className="text-sm text-gray-800">
                                                {appointment.duration}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                Appointment Notes
                                            </p>
                                            <p className="text-sm text-gray-800">
                                                {appointment.notes}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-red-600 mb-2">
                            {summaryStats.totalDonations}
                        </div>
                        <p className="text-sm text-zinc-600">Total Donations</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                            {summaryStats.bloodDonated}
                        </div>
                        <p className="text-sm text-zinc-600">
                            Total Volume Donated
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                            {summaryStats.nextEligible}
                        </div>
                        <p className="text-sm text-zinc-600">
                            Next Donation Date
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
