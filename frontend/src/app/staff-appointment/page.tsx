'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Calendar,
    Search,
    Filter,
    Clock,
    CheckCircle,
    UserCheck,
    AlertTriangle,
    Eye,
} from 'lucide-react';

export default function StaffAppointmentsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('all');

    // Mock data for donor appointments
    const appointments = [
        {
            id: 'apt-001',
            donorName: 'John Smith',
            bloodType: 'O-',
            scheduledDate: '2025-06-08',
            scheduledTime: '10:00 AM',
            status: 'confirmed',
            preScreeningComplete: true,
            healthRisk: 'low',
            lastDonation: '2025-03-15',
            contactNumber: '+1234567890',
            notes: 'Regular donor, no previous issues',
        },
        {
            id: 'apt-002',
            donorName: 'Mary Johnson',
            bloodType: 'A+',
            scheduledDate: '2025-06-08',
            scheduledTime: '10:30 AM',
            status: 'pending_review',
            preScreeningComplete: true,
            healthRisk: 'medium',
            lastDonation: '2025-04-20',
            contactNumber: '+1234567891',
            notes: 'Reported mild cold symptoms last week',
        },
        {
            id: 'apt-003',
            donorName: 'Robert Davis',
            bloodType: 'B-',
            scheduledDate: '2025-06-08',
            scheduledTime: '11:00 AM',
            status: 'confirmed',
            preScreeningComplete: true,
            healthRisk: 'low',
            lastDonation: '2025-02-10',
            contactNumber: '+1234567892',
            notes: 'First-time donor, completed orientation',
        },
        {
            id: 'apt-004',
            donorName: 'Sarah Brown',
            bloodType: 'AB+',
            scheduledDate: '2025-06-08',
            scheduledTime: '11:30 AM',
            status: 'needs_review',
            preScreeningComplete: false,
            healthRisk: 'high',
            lastDonation: null,
            contactNumber: '+1234567893',
            notes: 'New donor, pre-screening questionnaire flagged for review',
        },
        {
            id: 'apt-005',
            donorName: 'Michael Wilson',
            bloodType: 'O+',
            scheduledDate: '2025-06-08',
            scheduledTime: '2:00 PM',
            status: 'confirmed',
            preScreeningComplete: true,
            healthRisk: 'low',
            lastDonation: '2025-05-01',
            contactNumber: '+1234567894',
            notes: 'Regular donor, excellent health history',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-500';
            case 'pending_review':
                return 'bg-yellow-500';
            case 'needs_review':
                return 'bg-orange-500';
            case 'checked_in':
                return 'bg-blue-500';
            case 'completed':
                return 'bg-purple-500';
            case 'cancelled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'low':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'medium':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'high':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="h-4 w-4" />;
            case 'pending_review':
                return <Clock className="h-4 w-4" />;
            case 'needs_review':
                return <AlertTriangle className="h-4 w-4" />;
            case 'checked_in':
                return <UserCheck className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const filteredAppointments = appointments.filter((appointment) => {
        const matchesSearch =
            appointment.donorName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            appointment.bloodType
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            appointment.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' || appointment.status === statusFilter;
        const matchesTime =
            timeFilter === 'all' ||
            (timeFilter === 'morning' &&
                appointment.scheduledTime.includes('AM')) ||
            (timeFilter === 'afternoon' &&
                appointment.scheduledTime.includes('PM'));

        return matchesSearch && matchesStatus && matchesTime;
    });

    const appointmentsByStatus = {
        all: appointments,
        confirmed: appointments.filter((a) => a.status === 'confirmed'),
        needsReview: appointments.filter(
            (a) => a.status === 'needs_review' || a.status === 'pending_review',
        ),
        checkedIn: appointments.filter((a) => a.status === 'checked_in'),
    };

    const stats = {
        total: appointments.length,
        confirmed: appointments.filter((a) => a.status === 'confirmed').length,
        needsReview: appointments.filter(
            (a) => a.status === 'needs_review' || a.status === 'pending_review',
        ).length,
        checkedIn: appointments.filter((a) => a.status === 'checked_in').length,
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Donor Appointments
                    </h1>
                    <p className="text-gray-600">
                        Manage and process donor appointments
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Total Today
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {stats.total}
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Confirmed
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats.confirmed}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Need Review
                                </p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {stats.needsReview}
                                </p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Checked In
                                </p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {stats.checkedIn}
                                </p>
                            </div>
                            <UserCheck className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search by donor name, blood type, or appointment ID..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-32">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="confirmed">
                                        Confirmed
                                    </SelectItem>
                                    <SelectItem value="pending_review">
                                        Pending Review
                                    </SelectItem>
                                    <SelectItem value="needs_review">
                                        Needs Review
                                    </SelectItem>
                                    <SelectItem value="checked_in">
                                        Checked In
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={timeFilter}
                                onValueChange={setTimeFilter}
                            >
                                <SelectTrigger className="w-32">
                                    <Clock className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Times
                                    </SelectItem>
                                    <SelectItem value="morning">
                                        Morning
                                    </SelectItem>
                                    <SelectItem value="afternoon">
                                        Afternoon
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Appointments Table */}
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">
                        All ({appointmentsByStatus.all.length})
                    </TabsTrigger>
                    <TabsTrigger value="confirmed">
                        Confirmed ({appointmentsByStatus.confirmed.length})
                    </TabsTrigger>
                    <TabsTrigger value="needsReview">
                        Needs Review ({appointmentsByStatus.needsReview.length})
                    </TabsTrigger>
                    <TabsTrigger value="checkedIn">
                        Checked In ({appointmentsByStatus.checkedIn.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Appointments</CardTitle>
                            <CardDescription>
                                Complete list of today's donor appointments
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Donor</TableHead>
                                        <TableHead>Blood Type</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Health Risk</TableHead>
                                        <TableHead>Pre-Screening</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAppointments.map((appointment) => (
                                        <TableRow key={appointment.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {appointment.donorName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {appointment.id}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="font-mono"
                                                >
                                                    {appointment.bloodType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-gray-400" />
                                                    {appointment.scheduledTime}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(
                                                        appointment.status,
                                                    )}
                                                    <Badge
                                                        className={getStatusColor(
                                                            appointment.status,
                                                        )}
                                                    >
                                                        {appointment.status.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={getRiskColor(
                                                        appointment.healthRisk,
                                                    )}
                                                >
                                                    {appointment.healthRisk}{' '}
                                                    risk
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {appointment.preScreeningComplete ? (
                                                    <Badge className="bg-green-500 text-white">
                                                        Complete
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-yellow-500 text-white">
                                                        Pending
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/dashboard/staff/appointments/${appointment.id}`}
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Review
                                                        </Link>
                                                    </Button>
                                                    {appointment.status ===
                                                        'confirmed' && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/dashboard/staff/appointments/${appointment.id}/checkin`}
                                                            >
                                                                Check In
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="needsReview">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appointments Needing Review</CardTitle>
                            <CardDescription>
                                Appointments that require staff review before
                                proceeding
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {appointmentsByStatus.needsReview.map(
                                    (appointment) => (
                                        <div
                                            key={appointment.id}
                                            className="p-4 rounded-lg border bg-orange-50 border-orange-200"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <div className="font-medium">
                                                                {
                                                                    appointment.donorName
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {appointment.id}{' '}
                                                                •{' '}
                                                                {
                                                                    appointment.bloodType
                                                                }{' '}
                                                                •{' '}
                                                                {
                                                                    appointment.scheduledTime
                                                                }
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className={getRiskColor(
                                                                appointment.healthRisk,
                                                            )}
                                                        >
                                                            {
                                                                appointment.healthRisk
                                                            }{' '}
                                                            risk
                                                        </Badge>
                                                    </div>
                                                    <div className="mt-2 text-sm text-gray-600">
                                                        <strong>Notes:</strong>{' '}
                                                        {appointment.notes}
                                                    </div>
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        Last donation:{' '}
                                                        {appointment.lastDonation
                                                            ? new Date(
                                                                  appointment.lastDonation,
                                                              ).toLocaleDateString()
                                                            : 'First-time donor'}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/dashboard/staff/appointments/${appointment.id}`}
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Review Details
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="confirmed">
                    <Card>
                        <CardHeader>
                            <CardTitle>Confirmed Appointments</CardTitle>
                            <CardDescription>
                                Appointments ready for check-in
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {appointmentsByStatus.confirmed.map(
                                    (appointment) => (
                                        <div
                                            key={appointment.id}
                                            className="p-4 rounded-lg border bg-green-50 border-green-200"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <div className="font-medium">
                                                                {
                                                                    appointment.donorName
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {appointment.id}{' '}
                                                                •{' '}
                                                                {
                                                                    appointment.bloodType
                                                                }{' '}
                                                                •{' '}
                                                                {
                                                                    appointment.scheduledTime
                                                                }
                                                            </div>
                                                        </div>
                                                        <Badge className="bg-green-500 text-white">
                                                            Ready
                                                        </Badge>
                                                    </div>
                                                    <div className="mt-2 text-sm text-gray-600">
                                                        Contact:{' '}
                                                        {
                                                            appointment.contactNumber
                                                        }
                                                    </div>
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        Last donation:{' '}
                                                        {appointment.lastDonation
                                                            ? new Date(
                                                                  appointment.lastDonation,
                                                              ).toLocaleDateString()
                                                            : 'First-time donor'}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/dashboard/staff/appointments/${appointment.id}`}
                                                        >
                                                            View Details
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/dashboard/staff/appointments/${appointment.id}/checkin`}
                                                        >
                                                            Check In
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
