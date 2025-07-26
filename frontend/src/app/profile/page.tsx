'use client';

import { useEffect, useState } from 'react';
import {
    Droplets,
    Heart,
    MapPinIcon,
    PhoneIcon,
    MailIcon,
    CalendarIcon,
    UserIcon,
    CakeIcon,
    XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentAccount } from '@/hooks/use-current-account';
import { useUpdateAccountForm } from '@/hooks/use-update-account-form';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { AccountPicture } from '@/components/account-picture';
import { capitalCase } from 'change-case';
import { EditProfileModel } from '@/components/edit-profile';
import { differenceInYears } from 'date-fns';

export default function ProfilePage() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { data: account, isPending, error } = useCurrentAccount();
    const { mutation, form } = useUpdateAccountForm(account, {
        onSuccess() {
            setIsEditModalOpen(false);
        },
    });

    useEffect(() => {
        if (account) {
            form.reset({
                name: account.name,
                gender: account.gender,
                birthday: account.birthday,
                phone: account.phone,
                address: account.address,
            });
        }
    }, [account, form]);

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error('Login to use this feature');
        redirect('/auth/login');
    }

    return (
        <div className="my-10">
            <div className=" max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="flex size-14">
                                <AccountPicture name={account.name} />
                            </div>
                            <div>
                                <div className="flex gap-4">
                                    <h1 className="text-xl font-bold text-gray-800 mb-1">
                                        {account.name}
                                    </h1>
                                    {account.is_banned ? (
                                        <Badge
                                            variant="outline"
                                            className="text-xs border-red-200 text-red-700"
                                        >
                                            <XCircle className="h-3 w-3 mr-1" />
                                            Banned from donating
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className="text-xs border-green-200 text-green-700"
                                        >
                                            <Heart className="h-3 w-3 mr-1" />
                                            Active Donor
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-gray-400 mb-3">
                                    {account.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Profile Information
                                </h2>
                                <p className="text-gray-600">
                                    Manage your personal details and preferences
                                </p>
                            </div>
                            <EditProfileModel
                                isOpen={isEditModalOpen}
                                onOpenChange={setIsEditModalOpen}
                                form={form}
                                mutation={mutation}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserIcon className="h-5 w-5 text-blue-600" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <UserIcon className="h-4 w-4 text-gray-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {account.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Full Name
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CakeIcon className="h-4 w-4 text-gray-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {differenceInYears(
                                                    new Date(),
                                                    account.birthday,
                                                )}{' '}
                                                years old
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Age
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <UserIcon className="h-4 w-4 text-gray-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {capitalCase(account.gender)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Gender
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                                    <div className="flex items-center gap-3">
                                        <Droplets className="h-4 w-4 text-red-600" />
                                        <div>
                                            <p className="text-sm font-medium text-red-700">
                                                {
                                                    bloodGroupLabels[
                                                        account.blood_group
                                                    ]
                                                }
                                            </p>
                                            <p className="text-xs text-red-600">
                                                Blood Type
                                            </p>
                                        </div>
                                    </div>
                                    {account.blood_group == 'o_minus' && (
                                        <Badge className="bg-red-100 text-red-700 border-red-200">
                                            Universal
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MailIcon className="h-5 w-5 text-green-600" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <MailIcon className="h-4 w-4 text-gray-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {account.email}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Email Address
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <PhoneIcon className="h-4 w-4 text-gray-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {account.phone}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Phone Number
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <MapPinIcon className="h-4 w-4 text-gray-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {account.address}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Address
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CalendarIcon className="h-4 w-4 text-gray-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Date(
                                                    account.created_at,
                                                ).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Member Since
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
