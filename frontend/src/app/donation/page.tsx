'use client';
import { useState } from 'react';
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
import { Calendar, Droplet, Search, Download, CheckCircle } from 'lucide-react';
import { donationHistory } from '../../../constants/sample-data';
import { useCurrentAccountDonation } from '@/hooks/donation/useCurrentAccountDonation';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { displayDonationType, donationTypes } from '@/lib/api/dto/donation';

export default function DonationPage() {
    const { data: donations, isPending, error } = useCurrentAccountDonation();

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error('Login to use this feature');
        redirect('/auth/login');
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Donation History
                    </h1>
                    <p className="text-zinc-600">
                        Your complete record of life-saving donations
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                <Card>
                    <CardHeader>
                        <CardTitle> Impact</CardTitle>
                        <CardDescription>
                            How your donations have helped community
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <div className="text-3xl font-bold text-red-600 mb-1">
                                    {donations.length}
                                </div>
                                <div className="text-sm text-zinc-600">
                                    Total Donations
                                </div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-3xl font-bold text-blue-600 mb-1">
                                    {donations.reduce(
                                        (prev, cur) => prev + cur.amount,
                                        0,
                                    ) / 1000}
                                    L
                                </div>
                                <div className="text-sm text-zinc-600">
                                    Blood Donated
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Donation Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {donationTypes.map((type) => {
                                const count = donations.filter(
                                    (d) => d.type === type,
                                ).length;
                                const percentage =
                                    (count / donations.length) * 100;
                                return (
                                    <div key={type}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>
                                                {displayDonationType(type)}
                                            </span>
                                            <span>{count} donations</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-red-500 h-2 rounded-full"
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {donations.map((donation) => (
                    <Card
                        key={donation.id}
                        className="transition-colors shadow"
                    >
                        <CardHeader className="pb-3 flex flex-col lg:flex-row justify-between gap-4">
                            <div>
                                <div className="flex flex-row gap-4">
                                    <CardTitle className="text-base">
                                        {displayDonationType(donation.type)}
                                    </CardTitle>
                                    <Badge variant="outline">
                                        {donation.amount}ml
                                    </Badge>
                                </div>
                                <CardDescription className="flex flex-row pt-4 gap-5">
                                    <div className="flex flex-row gap-3">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {new Date(
                                                donation.created_at,
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                <Download className="mr-1 h-3 w-3" />
                                View Certificate
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="border-t pt-4">
                                <div className="space-y-5 text-sm">
                                    <div>
                                        <p className='text-md font-bold'>Donation Id</p>
                                        <p>{donation.id}</p>
                                    </div>
                                    <div>
                                        <p className='text-md font-bold'>Appointment Id</p>
                                        <p>{donation.appointment_id}</p>
                                    </div>
                                    <div>
                                        <p className='text-md font-bold'>Type</p>
                                        <p>{displayDonationType(donation.type)}</p>
                                    </div>
                                    <div>
                                        <p className='text-md font-bold'>Amount</p>
                                        <p>{donation.amount}ml</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
