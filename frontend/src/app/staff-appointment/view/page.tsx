'use client';
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { z } from "zod";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";  
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    User,
    Phone,
    Mail,
    UserCheck,
} from 'lucide-react';
import Link from 'next/link';
import { questionnaireAnswers, mockAppointment } from '../../../../constants/sample-data';


const reviewSchema = z.object({
    reviewNotes: z
      .string()
      .min(1, "Fill in your revision"),
  });

export default function StaffAppointmentDetailsPage() {

    const form = useForm({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
          reviewNotes: "",
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

            <div >
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-500" />
                                Donor Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-xl">
                                        ND
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        {mockAppointment.donorName}
                                    </h3>
                                    <p className="text-gray-500 mb-2">
                                        Blood Group: {mockAppointment.bloodType}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Appointment: 6/8/2025 at 10:00 AM
                                    </p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 mt-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">
                                        {mockAppointment.donorEmail}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">
                                        {mockAppointment.donorPhone}
                                    </span>
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
                                            <span className="font-semibold text-lg">Form Answer</span>
                                            <span className="text-sm text-muted-foreground">
                                                View the answers of the questions in the appointment apply form
                                            </span >
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

                    {viewState === "view" && (
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
                                        <FormLabel>Review Notes</FormLabel>
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
                            <Link
                                href="/staff-appointment/checkin"
                            >
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    Check In
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
