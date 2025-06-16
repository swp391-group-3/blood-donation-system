'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    Calendar,
    CalendarDays,
    Camera,
    Heart,
    Loader2,
    LoaderCircle,
    User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import {
    Account,
    bloodGroups,
    displayBloodGroup,
    displayGender,
    genders,
} from '@/lib/api/dto/account';
import { AccountPicture } from '@/components/account-picture';
import { useCurrentAccount } from '@/hooks/auth/useCurrentAccount';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { useUpdateAccountForm } from '@/hooks/account/useUpdateAccountForm';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

export default function ProfilePage() {
    const { data: account, isPending, error } = useCurrentAccount();
    const { mutation, form } = useUpdateAccountForm(account);

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error('Login to use this feature');
        redirect('/auth/login');
    }

    return (
        <div className="mx-5 my-20">
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="relative">
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                        <div className="h-28 bg-gradient-to-r from-blue-50 to-indigo-50 relative"></div>

                        <div className="px-8 py-6 relative">
                            <div className="flex size-16 justify-between items-end -mt-14 mb-6">
                                <AccountPicture name={account.name} />
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                        {account.name}
                                    </h1>
                                    <p className="text-gray-500">
                                        {account.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit((values) =>
                            mutation.mutate(values),
                        )}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Account basic information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid auto-cols-fr gap-5">
                                    <div className="grid gap-2">
                                        <Label>Email</Label>
                                        <Input disabled value={account.email} />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <FormLabel>Gender</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a gender" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {genders.map(
                                                            (gender, index) => (
                                                                <SelectItem
                                                                    key={index}
                                                                    value={
                                                                        gender
                                                                    }
                                                                >
                                                                    {displayGender(
                                                                        gender,
                                                                    )}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="birthday"
                                        render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <FormLabel>Birthday</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        {...field}
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid gap-2">
                                        <Label>Blood Group</Label>
                                        <Select
                                            disabled
                                            defaultValue={account.blood_group}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a blood group" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {bloodGroups.map(
                                                    (bloodGroup, index) => (
                                                        <SelectItem
                                                            key={index}
                                                            value={bloodGroup}
                                                        >
                                                            {displayBloodGroup(
                                                                bloodGroup,
                                                            )}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact</CardTitle>
                                <CardDescription>
                                    Contact information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid auto-cols-fr gap-5">
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="tel"
                                                        {...field}
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem className="grid gap-2">
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            data-loading={mutation.isPending}
                            className="group relative disabled:opacity-100"
                        >
                            <span className="group-data-[loading=true]:text-transparent">
                                Update
                            </span>
                            {mutation.isPending && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <LoaderCircle
                                        className="animate-spin"
                                        size={16}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </div>
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
