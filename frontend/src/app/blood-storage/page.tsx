'use client';
import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import RequestBloodDialog from '@/components/request-blood-form'
import {
    User,
    Package2,
    Search,
    MoreVertical,
    Droplet,
    Eye,
    Edit,
    RefreshCw,
} from 'lucide-react';
import {
    mockBloodBags,
    bloodTypeStats,
} from '../../../constants/sample-data';
import { TabsContent } from '@radix-ui/react-tabs';
import {
    getDemandColor,
    getPriorityColor,
    getStatusColor,
} from '../../lib/color'

export default function BloodBagsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');


    return (
        <div className="space-y-8 p-6 bg-gradient-to-br from-red-50 via-white to-pink-50 min-h-screen">
            <div className="relative overflow-hidden rounded-2xl bg-red-600 p-8 text-white shadow-2xl">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Blood Bank Management
                        </h1>
                        <p className="text-red-100 text-lg">
                            Hospital blood inventory tracking and management
                            system
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <RequestBloodDialog />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {bloodTypeStats.map((stat) => (
                    <Card
                        key={stat.type}
                        className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-red-50"></div>
                        <CardContent className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-full">
                                        <Droplet className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {stat.type}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Blood Type
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Available
                                    </span>
                                    <span className="font-bold text-green-600">
                                        {stat.available}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by ID, donor name, blood type"
                            type="search"
                            className="pl-10 h-9 border-gray-200 focus:border-red-300 focus:ring-red-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select>
                            <SelectTrigger className="w-[180px] h-12">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Statuses
                                </SelectItem>
                                <SelectItem value="Available">
                                    Available
                                </SelectItem>
                                <SelectItem value="Reserved">
                                    Reserved
                                </SelectItem>
                                <SelectItem value="Used">Used</SelectItem>
                                <SelectItem value="Expiring Soon">
                                    Expiring Soon
                                </SelectItem>
                                <SelectItem value="Expired">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[180px] h-12">
                                <SelectValue placeholder="Filter by blood type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Blood Types
                                </SelectItem>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[180px] h-12">
                                <SelectValue placeholder="Filter by priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Priorities
                                </SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <Tabs
                value={viewMode}
                onValueChange={(value) =>
                    setViewMode(value as 'table' | 'grid')
                }
            >
                <TabsList>
                    <TabsTrigger value="table">Table</TabsTrigger>
                    <TabsTrigger value="grid">Grid</TabsTrigger>
                </TabsList>
                <TabsContent value="table">
                    <Card className="border-0 shadow-lg overflow-hidden p-4 mt-4">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-semibold">
                                            Unit Info
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Blood Type
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Donor
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Collection
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Expiry Status
                                        </TableHead>
                                        <TableHead className="font-semibold text-center">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-right font-semibold">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockBloodBags.map((bag) => {
                                        return (
                                            <TableRow
                                                key={bag.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium text-gray-900">
                                                            {bag.id}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {bag.volume}ml
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-red-50 text-red-700 border-red-200 font-bold"
                                                    >
                                                        {bag.bloodType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium text-gray-900">
                                                            {bag.donorName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {bag.donorId}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-gray-900">
                                                        {bag.collectionDate}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="pr-4">
                                                    <div className="space-y-2">
                                                        <div className="text-sm text-gray-900">
                                                            {bag.expiryDate}
                                                        </div>
                                                        <Progress
                                                            value={100}
                                                            className="h-2 [&>div]:bg-red-500"
                                                        />

                                                        <div className="text-xs font-medium text-red-600">
                                                            Expired
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="flex justify-center items-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            'flex items-center gap-1 w-fit',
                                                            getStatusColor(
                                                                bag.status,
                                                            ),
                                                        )}
                                                    >
                                                        {bag.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-48"
                                                        >
                                                            <DropdownMenuItem className="flex items-center gap-2">
                                                                <Eye className="h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                                                <Droplet className="h-4 w-4" />
                                                                Request This
                                                                Unit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2">
                                                                <Edit className="h-4 w-4" />
                                                                Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2">
                                                                <RefreshCw className="h-4 w-4" />
                                                                Update Status
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>
                <TabsContent value="grid">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 ">
                        {mockBloodBags.map((bag) => {
                            return (
                                <Card
                                    key={bag.id}
                                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Package2 className="h-5 w-5 text-red-600" />
                                                    {bag.id}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {bag.donorName}
                                                </CardDescription>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="bg-red-50 text-red-800 border-red-200 font-bold text-lg"
                                            >
                                                {bag.bloodType}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 gap-3 text-sm">
                                            <div className="space-y-1 flex justify-between">
                                                <p className="text-gray-500">
                                                    Volume
                                                </p>
                                                <p className="font-medium">
                                                    {bag.volume}ml
                                                </p>
                                            </div>
                                            <div className="space-y-1 flex justify-between">
                                                <p className="text-gray-500">
                                                    Collection
                                                </p>
                                                <p className="font-medium">
                                                    {bag.collectionDate}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">
                                                    Expiry Status
                                                </span>
                                                <span className="text-xs font-medium text-red-600">
                                                    Expired
                                                </span>
                                            </div>
                                            <Progress
                                                value={100}
                                                className="h-2 [&>div]:bg-red-500"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    'flex items-center gap-1',
                                                    getStatusColor(bag.status),
                                                )}
                                            >
                                                {bag.status}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className={getPriorityColor(
                                                    bag.priority,
                                                )}
                                            >
                                                {bag.priority}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                            >
                                                <Eye className="h-3 w-3 mr-1" />
                                                View
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-red-600 hover:bg-red-700"
                                            >
                                                <Droplet className="h-3 w-3 mr-1" />
                                                Request
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
