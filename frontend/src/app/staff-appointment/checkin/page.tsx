'use client';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
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
import {mockDonor, mockAppointmentCheckin} from "../../../../constants/sample-data"

const healthDataSchema = z.object({
    temperature: z
        .string()
        .min(1, 'Temperature is required')
        .refine((val) => {
            const temp = Number.parseFloat(val);
            return !isNaN(temp) && temp >= 35 && temp <= 42;
        }, 'Temperature must be between 35°C and 42°C'),
    weight: z
        .string()
        .min(1, 'Weight is required')
        .refine((val) => {
            const weight = Number.parseFloat(val);
            return !isNaN(weight) && weight >= 30 && weight <= 200;
        }, 'Weight must be between 30kg and 200kg'),
    height: z
        .string()
        .min(1, 'Height is required')
        .refine((val) => {
            const height = Number.parseFloat(val);
            return !isNaN(height) && height >= 100 && height <= 250;
        }, 'Height must be between 100cm and 250cm'),
    bloodPressure: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            const bpPattern = /^\d{2,3}\/\d{2,3}$/;
            return bpPattern.test(val);
        }, 'Blood pressure must be in format XXX/XX'),
    pulse: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            const pulse = Number.parseFloat(val);
            return !isNaN(pulse) && pulse >= 40 && pulse <= 200;
        }, 'Pulse must be between 40 and 200 bpm'),
    hemoglobin: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            const hb = Number.parseFloat(val);
            return !isNaN(hb) && hb >= 5 && hb <= 20;
        }, 'Hemoglobin must be between 5 and 20 g/dL'),
    notes: z.string().optional(),
});

type HealthDataForm = z.infer<typeof healthDataSchema>;

export default function StaffCheckinPage() {
    const [healthStatus, setHealthStatus] = useState<
        'pending' | 'approved' | 'rejected'
    >('pending');

    const form = useForm<HealthDataForm>({
        resolver: zodResolver(healthDataSchema),
        defaultValues: {
            temperature: '',
            weight: '',
            height: '',
            bloodPressure: '',
            pulse: '',
            hemoglobin: '',
            notes: '',
        },
    })

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/staff-appointment/view">
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
                                ND
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
                                {mockDonor.phone}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Last Donation</p>
                            <p className="text-sm text-gray-500">
                                1/15/2024
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
                                {mockAppointmentCheckin.date} at{' '}
                                {mockAppointmentCheckin.time}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Health Measurements</CardTitle>
                    <CardDescription>
                        Record the donor's vital signs and health measurements
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className="space-y-6"
                        >
                            <div className="grid gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="temperature"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Thermometer className="h-4 w-4 text-red-500" />
                                                Temperature (°C) *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="36.5"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Normal range: 36.1°C - 37.2°C
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="weight"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Weight className="h-4 w-4 text-blue-500" />
                                                Weight (kg) *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="70"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Minimum: 50kg
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="height"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Ruler className="h-4 w-4 text-green-500" />
                                                Upper Blood Pressure
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="170"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bloodPressure"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Heart className="h-4 w-4 text-purple-500" />
                                                Lower Blood Pressure
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="120/80"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pulse"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pulse (bpm)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="72"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="hemoglobin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Hemoglobin (g/dL)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="13.5"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Separator />
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Medical Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Any observations, concerns, or additional notes about the donor's health..."
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
