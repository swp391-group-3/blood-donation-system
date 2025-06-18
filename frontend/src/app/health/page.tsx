'use client';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Heart,
    Activity,
    TrendingUp,
    Thermometer,
    Weight,
    Droplet,
    CheckCircle,
    ArrowUpNarrowWide,
} from 'lucide-react';
import {
    mockHealthRecords,
    weightChartData,
    hemoglobinChartData,
} from '../../../constants/sample-data';

const chartConfig = {
    weight: {
        label: 'Weight',
        color: 'oklch(70.7% 0.165 254.624)', // blue-400 tailwindcss
    },
};
export default function HealthRecordsPage() {
    const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-500';
            case 'rejected':
                return 'bg-red-500';
            case 'pending':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Health Records
                </h1>
                <p className="text-zinc-500">
                    Track your health data and donation eligibility
                </p>
            </div>

            <Tabs defaultValue="records" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="records">Health Records</TabsTrigger>
                    <TabsTrigger value="trends">Health Trends</TabsTrigger>
                    <TabsTrigger value="eligibility">
                        Eligibility Status
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="records" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-red-500" />
                                    Overall Health
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="font-medium text-green-600">
                                        Excellent
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-500 mt-1">
                                    Eligible for donation
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Thermometer className="h-5 w-5 text-orange-500" />
                                    Last Temperature
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">36.8°C</div>
                                <p className="text-sm text-zinc-500">
                                    Normal range
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Weight className="h-5 w-5 text-blue-500" />
                                    Current Weight
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">75kg</div>
                                <p className="text-sm text-zinc-500">
                                    +1kg from last visit
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Droplet className="h-5 w-5 text-purple-500" />
                                    Hemoglobin
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    14.2 g/dL
                                </div>
                                <p className="text-sm text-zinc-500">
                                    Excellent level
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between">
                                <div>
                                    <CardTitle className="pb-2">
                                        Health Screening History
                                    </CardTitle>
                                    <CardDescription>
                                        Your health records from donation
                                        appointments
                                    </CardDescription>
                                </div>
                                <div>
                                    <Select defaultValue="newest">
                                        <SelectTrigger className="w-[180px]">
                                            <ArrowUpNarrowWide />
                                            Newest first
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">
                                                Newest first
                                            </SelectItem>
                                            <SelectItem value="oldest">
                                                Oldest first
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockHealthRecords.map((record) => (
                                    <Card
                                        key={record.id}
                                        className={
                                            'transition-colors cursor-pointer shadow' +
                                            (selectedRecord === record.id
                                                ? 'border-primary/60 shadow-lg'
                                                : 'hover:bg-muted/30')
                                        }
                                        onClick={() =>
                                            setSelectedRecord(
                                                selectedRecord === record.id
                                                    ? null
                                                    : record.id,
                                            )
                                        }
                                    >
                                        <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <CardTitle className="text-base">
                                                        {new Date(
                                                            record.date,
                                                        ).toLocaleDateString()}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        Appointment{' '}
                                                        {record.appointmentId}
                                                    </CardDescription>
                                                </div>
                                                <Badge
                                                    className={getStatusColor(
                                                        record.status,
                                                    )}
                                                >
                                                    Approve
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="text-center">
                                                    <p className="font-medium">
                                                        {record.temperature}°C
                                                    </p>
                                                    <p className="text-gray-500">
                                                        Temp
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-medium">
                                                        {record.weight}kg
                                                    </p>
                                                    <p className="text-gray-500">
                                                        Weight
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-medium">
                                                        {record.hemoglobin}
                                                    </p>
                                                    <p className="text-gray-500">
                                                        Hb g/dL
                                                    </p>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        {selectedRecord === record.id && (
                                            <CardContent>
                                                <div className="grid gap-4 md:grid-cols-1 border-t pt-4">
                                                    <div>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between">
                                                                <span>
                                                                    Temperature:
                                                                </span>
                                                                <span>
                                                                    {
                                                                        record.temperature
                                                                    }
                                                                    °C
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>
                                                                    Weight:
                                                                </span>
                                                                <span>
                                                                    {
                                                                        record.weight
                                                                    }
                                                                    kg
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>
                                                                    Upper Blood
                                                                    Pressure:
                                                                </span>
                                                                <span>
                                                                    {
                                                                        record.bloodPressure
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>
                                                                    Lower Blood
                                                                    Pressure:
                                                                </span>
                                                                <span>
                                                                    {
                                                                        record.bloodPressure
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>
                                                                    Pulse:
                                                                </span>
                                                                <span>
                                                                    {
                                                                        record.pulse
                                                                    }{' '}
                                                                    bpm
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>
                                                                    Hemoglobin:
                                                                </span>
                                                                <span>
                                                                    {
                                                                        record.hemoglobin
                                                                    }{' '}
                                                                    g/dL
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="border-t pt-4 flex justify-between">
                                                        <h4 className="font-medium mb-2">
                                                            Medical Notes
                                                        </h4>
                                                        <p className="text-sm text-zinc-600">
                                                            {record.notes}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="trends" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-500" />
                                    Weight Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">
                                            Current: 75kg
                                        </span>
                                        <span className="text-sm text-green-600">
                                            +2kg (3 months)
                                        </span>
                                    </div>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Bar Chart - Weight
                                            </CardTitle>
                                            <CardDescription>
                                                January - July 2025
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ChartContainer
                                                config={chartConfig}
                                            >
                                                <BarChart
                                                    accessibilityLayer
                                                    data={weightChartData}
                                                >
                                                    <CartesianGrid
                                                        vertical={false}
                                                    />
                                                    <XAxis
                                                        dataKey="month"
                                                        tickMargin={10}
                                                        axisLine={false}
                                                        tickFormatter={(
                                                            value,
                                                        ) => value.slice(0, 3)}
                                                    />
                                                    <ChartTooltip
                                                        cursor={false}
                                                        content={
                                                            <ChartTooltipContent
                                                                hideLabel
                                                            />
                                                        }
                                                    />
                                                    <Bar
                                                        dataKey="weight"
                                                        fill="oklch(70.7% 0.165 254.624)"
                                                        radius={8}
                                                    />
                                                </BarChart>
                                            </ChartContainer>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-red-500" />
                                    Hemoglobin Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">
                                            Current: 14.2 g/dL
                                        </span>
                                        <span className="text-sm text-green-600">
                                            Stable
                                        </span>
                                    </div>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Bar Chart - Hemoglobin
                                            </CardTitle>
                                            <CardDescription>
                                                January - July 2025
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ChartContainer
                                                config={chartConfig}
                                            >
                                                <BarChart
                                                    accessibilityLayer
                                                    data={hemoglobinChartData}
                                                >
                                                    <CartesianGrid
                                                        vertical={false}
                                                    />
                                                    <XAxis
                                                        dataKey="month"
                                                        tickMargin={10}
                                                        axisLine={false}
                                                        tickFormatter={(
                                                            value,
                                                        ) => value.slice(0, 3)}
                                                    />
                                                    <ChartTooltip
                                                        cursor={false}
                                                        content={
                                                            <ChartTooltipContent
                                                                hideLabel
                                                            />
                                                        }
                                                    />
                                                    <Bar
                                                        dataKey="hemoglobin"
                                                        fill="oklch(63.7% 0.237 25.331)"
                                                        radius={8}
                                                    />
                                                </BarChart>
                                            </ChartContainer>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Health Insights</CardTitle>
                            <CardDescription>
                                AI-powered insights based on your health trends
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-green-800">
                                            Excellent Health Trend
                                        </h4>
                                        <p className="text-sm text-green-700">
                                            Your hemoglobin levels are
                                            consistently excellent, indicating
                                            good iron levels and overall health.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-blue-800">
                                            Weight Stability
                                        </h4>
                                        <p className="text-sm text-blue-700">
                                            Your weight has been gradually
                                            increasing, which is positive for
                                            donation eligibility.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="eligibility" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Current Eligibility Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-green-800">
                                            Eligible for Donation
                                        </h3>
                                        <p className="text-sm text-green-700">
                                            You meet all health requirements for
                                            blood donation
                                        </p>
                                    </div>
                                    <Badge className="bg-green-500">
                                        Approved
                                    </Badge>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-3">
                                        <h4 className="font-medium">
                                            Health Requirements
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="text-sm">
                                                    Age: 18-65 years ✓
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="text-sm">
                                                    Weight: ≥50kg ✓
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="text-sm">
                                                    Hemoglobin: ≥12.5 g/dL ✓
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="text-sm">
                                                    Blood pressure: Normal ✓
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-medium">
                                            Time Requirements
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="text-sm">
                                                    Last donation: 8+ weeks ago
                                                    ✓
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="text-sm">
                                                    No recent illness ✓
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="text-sm">
                                                    No recent travel
                                                    restrictions ✓
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">
                                                Next Eligible Donation Date
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                Based on your last donation
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-green-600">
                                                Available Now
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                You can donate today
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
