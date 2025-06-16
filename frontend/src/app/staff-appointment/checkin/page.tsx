'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    AlertCircle,
    Thermometer,
    Weight,
    Ruler,
    Heart,
    User,
    CheckCircle,
    XCircle,
    ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

// Mock donor data
const mockDonor = {
    id: 'donor-123',
    name: 'John Smith',
    bloodGroup: 'O-',
    email: 'john.smith@email.com',
    phone: '+1234567890',
    lastDonation: '2025-03-15',
    totalDonations: 4,
};

// Mock appointment data
const mockAppointment = {
    id: '1',
    requestTitle: 'Emergency O- needed for surgery',
    date: '2025-06-03',
    time: '10:00 AM',
    status: 'confirmed',
};

export default function StaffCheckinPage() {
    const params = useParams();
    const router = useRouter();

    const [healthData, setHealthData] = useState({
        temperature: '',
        weight: '',
        height: '',
        bloodPressure: '',
        pulse: '',
        hemoglobin: '',
        notes: '',
    });

    const [healthStatus, setHealthStatus] = useState<
        'pending' | 'approved' | 'rejected'
    >('pending');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setHealthData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const isHealthDataComplete = () => {
        return healthData.temperature && healthData.weight && healthData.height;
    };

    const checkHealthStatus = () => {
        const temp = Number.parseFloat(healthData.temperature);
        const weight = Number.parseFloat(healthData.weight);
        const systolic = healthData.bloodPressure
            ? Number.parseInt(healthData.bloodPressure.split('/')[0])
            : 0;
        const hemoglobin = Number.parseFloat(healthData.hemoglobin);

        // Health validation rules
        const tempOk = temp >= 36.1 && temp <= 37.2;
        const weightOk = weight >= 50;
        const bpOk = !systolic || (systolic >= 90 && systolic <= 180);
        const hbOk = !hemoglobin || hemoglobin >= 12.5;

        return tempOk && weightOk && bpOk && hbOk;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/staff/appointments">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Appointments
                        </Link>
                    </Button>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Health Screening - Check-in
                </h1>
                <p className="text-gray-500">
                    Record donor health measurements and approve for donation
                </p>
            </div>

            {/* Donor Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-500" />
                        Donor Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback className="text-lg">
                                {mockDonor.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-medium">
                                {mockDonor.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Blood Group: {mockDonor.bloodGroup}
                            </p>
                        </div>
                        {healthStatus === 'approved' && (
                            <Badge className="bg-green-500 ml-auto">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approved
                            </Badge>
                        )}
                        {healthStatus === 'rejected' && (
                            <Badge className="bg-red-500 ml-auto">
                                <XCircle className="h-3 w-3 mr-1" />
                                Rejected
                            </Badge>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <p className="text-sm font-medium">Contact</p>
                            <p className="text-sm text-gray-500">
                                {mockDonor.email}
                            </p>
                            <p className="text-sm text-gray-500">
                                {mockDonor.phone}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Last Donation</p>
                            <p className="text-sm text-gray-500">
                                {new Date(
                                    mockDonor.lastDonation,
                                ).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                Total Donations
                            </p>
                            <p className="text-sm text-gray-500">
                                {mockDonor.totalDonations} times
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Appointment</p>
                            <p className="text-sm text-gray-500">
                                {mockAppointment.date} at {mockAppointment.time}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Health Measurements */}
            <Card>
                <CardHeader>
                    <CardTitle>Health Measurements</CardTitle>
                    <CardDescription>
                        Record the donor's vital signs and health measurements
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label
                                htmlFor="temperature"
                                className="flex items-center gap-2"
                            >
                                <Thermometer className="h-4 w-4 text-red-500" />
                                Temperature (°C) *
                            </Label>
                            <Input
                                id="temperature"
                                type="number"
                                step="0.1"
                                placeholder="36.5"
                                value={healthData.temperature}
                                onChange={(e) =>
                                    handleInputChange(
                                        'temperature',
                                        e.target.value,
                                    )
                                }
                            />
                            <p className="text-xs text-gray-500">
                                Normal range: 36.1°C - 37.2°C
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="weight"
                                className="flex items-center gap-2"
                            >
                                <Weight className="h-4 w-4 text-blue-500" />
                                Weight (kg) *
                            </Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                placeholder="70"
                                value={healthData.weight}
                                onChange={(e) =>
                                    handleInputChange('weight', e.target.value)
                                }
                            />
                            <p className="text-xs text-gray-500">
                                Minimum: 50kg
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="height"
                                className="flex items-center gap-2"
                            >
                                <Ruler className="h-4 w-4 text-green-500" />
                                Height (cm) *
                            </Label>
                            <Input
                                id="height"
                                type="number"
                                placeholder="170"
                                value={healthData.height}
                                onChange={(e) =>
                                    handleInputChange('height', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="bloodPressure"
                                className="flex items-center gap-2"
                            >
                                <Heart className="h-4 w-4 text-purple-500" />
                                Blood Pressure (mmHg)
                            </Label>
                            <Input
                                id="bloodPressure"
                                placeholder="120/80"
                                value={healthData.bloodPressure}
                                onChange={(e) =>
                                    handleInputChange(
                                        'bloodPressure',
                                        e.target.value,
                                    )
                                }
                            />
                            <p className="text-xs text-gray-500">
                                Normal range: 90-180 systolic
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pulse">Pulse (bpm)</Label>
                            <Input
                                id="pulse"
                                type="number"
                                placeholder="72"
                                value={healthData.pulse}
                                onChange={(e) =>
                                    handleInputChange('pulse', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hemoglobin">
                                Hemoglobin (g/dL)
                            </Label>
                            <Input
                                id="hemoglobin"
                                type="number"
                                step="0.1"
                                placeholder="13.5"
                                value={healthData.hemoglobin}
                                onChange={(e) =>
                                    handleInputChange(
                                        'hemoglobin',
                                        e.target.value,
                                    )
                                }
                            />
                            <p className="text-xs text-gray-500">
                                Minimum: 12.5 g/dL
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="notes">Medical Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Any observations, concerns, or additional notes about the donor's health..."
                            value={healthData.notes}
                            onChange={(e) =>
                                handleInputChange('notes', e.target.value)
                            }
                            rows={3}
                        />
                    </div>

                    {/* Health Status Indicator */}
                    {isHealthDataComplete() && (
                        <div
                            className={`p-4 rounded-lg ${checkHealthStatus() ? 'bg-green-50' : 'bg-red-50'}`}
                        >
                            <div className="flex items-center gap-2">
                                {checkHealthStatus() ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                )}
                                <h4
                                    className={`font-medium ${checkHealthStatus() ? 'text-green-800' : 'text-red-800'}`}
                                >
                                    {checkHealthStatus()
                                        ? 'Health Parameters Normal'
                                        : 'Health Parameters Out of Range'}
                                </h4>
                            </div>
                            <p
                                className={`text-sm mt-1 ${checkHealthStatus() ? 'text-green-700' : 'text-red-700'}`}
                            >
                                {checkHealthStatus()
                                    ? 'All vital signs are within acceptable ranges for blood donation.'
                                    : 'One or more vital signs are outside the acceptable range for donation.'}
                            </p>
                        </div>
                    )}

                    {healthStatus === 'pending' && (
                        <div className="flex gap-4 pt-4">
                            <Button
                                variant="outline"
                                disabled={isSubmitting}
                                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                            >
                                {isSubmitting
                                    ? 'Processing...'
                                    : 'Reject for Donation'}
                            </Button>
                            <Button
                                disabled={
                                    !isHealthDataComplete() || isSubmitting
                                }
                                className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                                {isSubmitting
                                    ? 'Processing...'
                                    : 'Approve for Donation'}
                            </Button>
                        </div>
                    )}

                    {healthStatus === 'approved' && (
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <h4 className="font-medium text-green-800">
                                    Donor Approved
                                </h4>
                            </div>
                            <p className="text-sm text-green-700 mb-3">
                                Health screening completed successfully. Donor
                                can proceed to donation area.
                            </p>
                            <Button
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() =>
                                    router.push(
                                        `/dashboard/staff/appointments/${params.id}/donate`,
                                    )
                                }
                            >
                                Proceed to Blood Collection
                            </Button>
                        </div>
                    )}

                    {healthStatus === 'rejected' && (
                        <div className="bg-red-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <XCircle className="h-5 w-5 text-red-600" />
                                <h4 className="font-medium text-red-800">
                                    Donation Not Approved
                                </h4>
                            </div>
                            <p className="text-sm text-red-700">
                                Donor has been marked as not suitable for
                                donation today. Please provide appropriate
                                guidance and schedule a follow-up if needed.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
