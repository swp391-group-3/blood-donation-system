"use client"
import { useEffect, useState } from 'react'
import {
    User, Droplets, Shield, Heart, Trophy, Activity, BarChart3, Clock, MapPinIcon,
    PhoneIcon, MailIcon, CalendarIcon, UserIcon, CakeIcon
} from "lucide-react"
import { Badge } from '@/components/ui/badge';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentAccount } from '@/hooks/use-current-account';
import { useUpdateAccountForm } from '@/hooks/use-update-account-form';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { AccountPicture } from '@/components/account-picture';
import { capitalCase } from 'change-case';
import { EditProfileModel } from '@/components/edit-profile';
import { useCurrentAccountDonation } from '@/hooks/use-current-account-donation';
import { displayDonationType } from '@/lib/api/dto/donation';
import { AchievementCard } from '@/components/achievement-card';

// Enhanced stats
const mockStats = {
    totalDonations: 12,
    memberSince: "2023",
    currentLevel: 3,
    nextLevelProgress: 75,
    totalPoints: 2400,
    nextDonationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    lastDonationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
}

// Achievement system
const mockAchievements = [
    {
        id: 1,
        title: "First Drop",
        description: "Complete your first blood donation",
        category: "milestone",
        earned: true,
        earnedDate: new Date("2023-02-15"),
        points: 100,
        rarity: "common",
    },
    {
        id: 2,
        title: "Streak Master",
        description: "Maintain a 5-donation streak",
        category: "streak",
        earned: true,
        earnedDate: new Date("2023-08-20"),
        points: 200,
        rarity: "rare",
    },
    {
        id: 3,
        title: "Life Saver",
        description: "Help save 30+ lives through donations",
        category: "impact",
        earned: true,
        earnedDate: new Date("2023-11-10"),
        points: 300,
        rarity: "epic",
    },
    {
        id: 4,
        title: "Health Champion",
        description: "Maintain 90+ health score for 6 months",
        category: "health",
        earned: true,
        earnedDate: new Date("2023-12-01"),
        points: 250,
        rarity: "rare",
    },
    {
        id: 5,
        title: "Perfect Score",
        description: "Achieve 100% health score",
        category: "health",
        earned: false,
        points: 500,
        rarity: "legendary",
    },
    {
        id: 6,
        title: "Community Hero",
        description: "Complete 20 blood donations",
        category: "milestone",
        earned: false,
        points: 400,
        rarity: "epic",
    },
]

export default function ProfilePage() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all")
    const { data: account, isPending, error } = useCurrentAccount();
    const { data: donations } = useCurrentAccountDonation();
    const { mutation, form } = useUpdateAccountForm(account, {
        onSuccess() {
            setIsEditModalOpen(false)
        },
    });
    const filterDonations = donations?.slice(0, 3);

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

    const calculateAge = (birthday: string) => {
        const today = new Date()
        const birthDate = new Date(birthday)
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    const daysUntilNextDonation = Math.ceil((mockStats.nextDonationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    const filteredAchievements =
        selectedCategory === "all" ? mockAchievements : mockAchievements.filter((a) => a.category === selectedCategory)
    return (
        <div className='min-h-screen bg-gray-50'>
            <div className=" max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Account  */}
                <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8'>
                    <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8'>
                        {/* Profile Info */}
                        <div className='flex items-center gap-6'>
                            <div className='flex size-14'>
                                <AccountPicture name={account.name} />
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold text-gray-800 mb-1'>{account.name}</h1>
                                <p className='text-gray-400 mb-3'> {account.email}</p>
                                <div className='flex items-center gap-3'>
                                    <Badge variant="secondary" className='text-[13px] rounded-2xl'>
                                        <Shield className="h-3 w-3 mr-1" />
                                        Verified
                                    </Badge>
                                    <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                                        <Heart className="h-3 w-3 mr-1" />
                                        Active Donor
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-gray-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{donations?.length}</p>
                                    <p className="text-sm text-gray-600">Total Donations</p>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg">
                                    <Droplets className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs content */}
                <div>
                    <Tabs defaultValue='profile' className='space-y-4'>
                        <TabsList className='grid grid-cols-1 lg:grid-cols-3 mb-8'>
                            <TabsTrigger value='profile'>
                                <User className='mr-2 h-4 w-4 text-gray-700' />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger value='overview'>
                                <BarChart3 className='mr-2 h-4 w-4 text-gray-700' />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value='achievement'>
                                <Trophy className='mr-2 h-4 w-4 text-gray-700' />
                                Achievement
                            </TabsTrigger>
                        </TabsList>
                        {/* Profile */}
                        <TabsContent value="profile" className="space-y-4">
                            <div className="space-y-8">
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <h2 className='text-2xl font-bold text-gray-900'>Profile Information</h2>
                                        <p className='text-gray-600'>Manage your personal details and preferences</p>
                                    </div>
                                    <EditProfileModel
                                        isOpen={isEditModalOpen}
                                        onOpenChange={setIsEditModalOpen}
                                        form={form}
                                        mutation={mutation}
                                    />
                                </div>
                            </div>

                            {/* PROFILE OVERVIEW */}
                            {/* Detailed Info & Contact Info */}
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                                {/* Detailed Info  */}
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
                                                    <p className="text-sm font-medium text-gray-900">{account.name}</p>
                                                    <p className="text-xs text-gray-500">Full Name</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <CakeIcon className="h-4 w-4 text-gray-600" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{calculateAge(account.birthday)} years old</p>
                                                    <p className="text-xs text-gray-500">Age</p>
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
                                                    <p className="text-xs text-gray-500">Gender</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                                            <div className="flex items-center gap-3">
                                                <Droplets className="h-4 w-4 text-red-600" />
                                                <div>
                                                    <p className="text-sm font-medium text-red-700">{bloodGroupLabels[account.blood_group]}</p>
                                                    <p className="text-xs text-red-600">Blood Type</p>
                                                </div>
                                            </div>
                                            {account.blood_group == "o_minus" && (
                                                <Badge className="bg-red-100 text-red-700 border-red-200">Universal</Badge>
                                            )}

                                        </div>
                                    </CardContent>
                                </Card>
                                {/*Contact Info */}
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
                                                    <p className="text-sm font-medium text-gray-900">{account.email}</p>
                                                    <p className="text-xs text-gray-500">Email Address</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <PhoneIcon className="h-4 w-4 text-gray-600" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{account.phone}</p>
                                                    <p className="text-xs text-gray-500">Phone Number</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <MapPinIcon className="h-4 w-4 text-gray-600 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{account.address}</p>
                                                    <p className="text-xs text-gray-500">Address</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <CalendarIcon className="h-4 w-4 text-gray-600" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {new Date(account.created_at).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Member Since</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        {/* OVERVIEW */}
                        <TabsContent value="overview" className="space-y-4">
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Next Donation */}
                                    <Card className="lg:col-span-2 border-gray-200">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Clock className="h-5 w-5 text-blue-600" />
                                                Next Donation
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center py-12 bg-blue-50 rounded-lg mb-6">
                                                <div className="text-4xl font-bold text-gray-900 mb-2">{daysUntilNextDonation}</div>
                                                <div className="text-gray-600">days remaining</div>
                                                <div className="text-sm text-gray-500 mt-1">Until you can donate again</div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Recent Activity */}
                                    <Card className="border-gray-200">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Activity className="h-5 w-5 text-green-600" />
                                                Recent Activity
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {filterDonations?.map(donation => (
                                                    <div
                                                        key={donation.id}
                                                        className="bg-white rounded-2xl shadow-sm border-l-2 border-green-500 p-3 flex flex-col"
                                                    >
                                                        <p className="text-lg font-semibold text-gray-800">{donation.amount} ml</p>
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                                                {displayDonationType(donation.type)}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(donation.created_at).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>
                        {/* ACHIEVEMENT */}
                        <TabsContent value="achievement" className="space-y-4">
                            <div className="space-y-8">
                                {/* Category Filter */}
                                <div className="flex flex-wrap gap-2">
                                    {["all", "milestone", "streak", "impact", "health"].map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category
                                                ? "bg-blue-600 text-white"
                                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            {capitalCase(category)}
                                        </button>
                                    ))}
                                </div>

                                {/* Achievement Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredAchievements.map((achievement) => {
                                        return (
                                            <AchievementCard key={achievement.id} achievement={achievement} />
                                        )
                                    })}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs >
                </div >
            </div >
        </div >
    )
}