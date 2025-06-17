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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    User,
    Calendar,
    Phone,
    Mail,
    Heart,
    Activity,
    AlertTriangle,
    CheckCircle,
    ArrowLeft,
    UserCheck,
    XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { questionnaireAnswers, mockAppointment } from '../../../../constants/sample-data';



export default function StaffAppointmentDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const [reviewNotes, setReviewNotes] = useState('');
    const [decision, setDecision] = useState<
        'pending' | 'approved' | 'rejected'
    >('pending');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getEligibilityScore = () => {
        let score = 100;
        if (
            mockAppointment.questionnaire.eligibility.recentTravel.includes(
                'Canada',
            )
        )
            score -= 10;
        if (
            mockAppointment.questionnaire.eligibility.alcoholConsumption !==
            'No alcohol'
        )
            score -= 5;
        const lastDonationDate = new Date(
            mockAppointment.questionnaire.eligibility.lastDonation,
        );
        const daysSinceLastDonation = Math.floor(
            (Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (daysSinceLastDonation < 56) score -= 30;
        return Math.max(0, score);
    };

    const eligibilityScore = getEligibilityScore();

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
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

            <div className="grid gap-6 lg:grid-cols-3">
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
                                            className="transition-all duration-300 mb-4 "
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
                            <div className="space-y-2">
                                <Label htmlFor="review-notes">
                                    Review Notes
                                </Label>
                                <Textarea
                                    id="review-notes"
                                    placeholder="Add your review notes, observations, or reasons for approval/rejection..."
                                    value={reviewNotes}
                                    onChange={(e) =>
                                        setReviewNotes(e.target.value)
                                    }
                                    rows={4}
                                />
                            </div>

                            {decision === 'pending' && (
                                <div className="flex gap-4">
                                    <Button
                                        disabled={isSubmitting}
                                        variant="outline"
                                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                        {isSubmitting
                                            ? 'Processing...'
                                            : 'Reject Appointment'}
                                        <XCircle className="ml-2 h-4 w-4" />
                                    </Button>
                                    <Button
                                        disabled={isSubmitting}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        {isSubmitting
                                            ? 'Processing...'
                                            : 'Approve for Donation'}
                                        <CheckCircle className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {decision === 'approved' && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <h4 className="font-medium text-green-800">
                                            Appointment Approved
                                        </h4>
                                    </div>
                                    <p className="text-sm text-green-700 mt-1">
                                        The donor has been approved and can
                                        proceed to check-in.
                                    </p>
                                    <div className="mt-3">
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700"
                                            asChild
                                        >
                                            <Link
                                                href={`/dashboard/staff/appointments/${params.id}/checkin`}
                                            >
                                                Proceed to Check-in
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {decision === 'rejected' && (
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-5 w-5 text-red-600" />
                                        <h4 className="font-medium text-red-800">
                                            Appointment Rejected
                                        </h4>
                                    </div>
                                    <p className="text-sm text-red-700 mt-1">
                                        The donor has been notified with your
                                        feedback.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-500" />
                                Appointment Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-medium">
                                    {mockAppointment.donorName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    ID: {mockAppointment.id}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Date:</span>
                                    <span>
                                        {new Date(
                                            mockAppointment.scheduledDate,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Time:</span>
                                    <span>{mockAppointment.scheduledTime}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Blood Type:
                                    </span>
                                    <Badge variant="outline">
                                        {mockAppointment.bloodType}
                                    </Badge>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Status:
                                    </span>
                                    <Badge
                                        className={
                                            mockAppointment.status ===
                                            'confirmed'
                                                ? 'bg-green-500'
                                                : mockAppointment.status ===
                                                    'pending_review'
                                                  ? 'bg-yellow-500'
                                                  : 'bg-orange-500'
                                        }
                                    >
                                        {mockAppointment.status.replace(
                                            '_',
                                            ' ',
                                        )}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
