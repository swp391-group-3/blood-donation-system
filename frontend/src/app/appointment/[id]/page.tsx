'use client';
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { User, UserCheck } from 'lucide-react';
import {
    questionnaireAnswers,
} from '../../../../constants/sample-data';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';

const reviewSchema = z.object({
    reviewNotes: z.string().min(1, 'Fill in your revision'),
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
    upperBloodPressure: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            const bpPattern = /^\d{2,3}\/\d{2,3}$/;
            return bpPattern.test(val);
        }, 'Blood pressure must be in format XXX/XX'),
    lowerBloodPressure: z
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

export default function StaffAppointmentDetailsPage() {
    const form = useForm({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            reviewNotes: '',
            temperature: '',
            weight: '',
            upperBloodPressure: '',
            lowerBloodPressure: '',
            pulse: '',
            hemoglobin: '',
            notes: '',
        },
    });

    const [viewState, setViewState] = useState('view');

    return (
        <div className="max-w-3xl mx-auto space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Appointment Review
                    </h1>
                    <p className="text-gray-500">
                        Review donor information and approve for donation
                    </p>
                </div>
            </div>

            <div>
                <div className="lg:col-span-2 space-y-6">
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
                                        Nam Dang
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Blood Group: O-
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <p className="text-sm font-medium">
                                        Contact
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        0123456789
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Last Donation
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        1/15/2024
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Total Donations
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        10 times
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Appointment
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        2024-06-17 at 10:30 AM
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <Card className="w-full">
                                <CardHeader>
                                    <AccordionTrigger>
                                        <div className="flex flex-col w-full cursor-pointer">
                                            <span className="font-semibold text-lg">
                                                Form Answer
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                View the answers of the
                                                questions in the appointment
                                                apply form
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                </CardHeader>
                            </Card>
                            <AccordionContent>
                                {questionnaireAnswers.map((question, index) => {
                                    return (
                                        <Card
                                            key={question.id}
                                            className="transition-all duration-300 my-4"
                                        >
                                            <CardHeader className="flex flex-row items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-green-100 text-green-600">
                                                        {index + 1}
                                                    </span>
                                                    <div className="flex-1">
                                                        <CardTitle className="text-lg">
                                                            {question.question}
                                                        </CardTitle>
                                                        <CardDescription className="mt-2">
                                                            {question.answer}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    );
                                })}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {viewState === 'view' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCheck className="h-5 w-5 text-purple-500" />
                                    Staff Review
                                </CardTitle>
                                <CardDescription>
                                    Add your review notes and make a decision
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Form {...form}>
                                    <form className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="reviewNotes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Review Notes
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            placeholder="Add your review notes, observations, or reasons for approval/rejection..."
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </form>
                                </Form>
                                <div className="flex gap-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        onClick={() => setViewState('checkin')}
                                    >
                                        Approve
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {viewState === 'checkin' && (
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Health Measurements</CardTitle>
                                    <CardDescription>
                                        Record the donor&apos;s vital signs and
                                        health measurements
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...form}>
                                        <form className="space-y-6">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name="temperature"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2">
                                                                Temperature (°C)
                                                                *
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="36.5"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Normal range:
                                                                36.1°C - 37.2°C
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
                                                    name="upperBloodPressure"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2">
                                                                Upper Blood
                                                                Pressure
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
                                                    name="lowerBloodPressure"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2">
                                                                Lower Blood
                                                                Pressure
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
                                                            <FormLabel>
                                                                Pulse (bpm)
                                                            </FormLabel>
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
                                                                Hemoglobin
                                                                (g/dL)
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
                                                        <FormLabel>
                                                            Medical Notes
                                                        </FormLabel>
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
                            <div className="flex gap-4 mt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                >
                                    Reject
                                </Button>
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    Approve
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
