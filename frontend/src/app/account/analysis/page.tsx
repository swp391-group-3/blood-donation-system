"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
    Users,
    Activity,
    AlertTriangle,
    Droplets,
} from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts"

// Mock data 
const mockStats = {
    totalUsers: 1247,
    activeRequests: 23,
    todayDonations: 8,
    bloodBagsAvailable: 156,
    pendingAppointments: 45,
}

// Chart data - 
const donationTrends = [
    { month: "Jan", donations: 65, requests: 45 },
    { month: "Feb", donations: 78, requests: 52 },
    { month: "Mar", donations: 90, requests: 48 },
    { month: "Apr", donations: 81, requests: 61 },
    { month: "May", donations: 95, requests: 55 },
    { month: "Jun", donations: 87, requests: 67 },
    { month: "Jul", donations: 92, requests: 60 },
    { month: "Aug", donations: 85, requests: 58 },
    { month: "Sep", donations: 88, requests: 62 },
    { month: "Oct", donations: 94, requests: 70 },
    { month: "Nov", donations: 90, requests: 66 },
    { month: "Dec", donations: 97, requests: 71 },
];

// Updated color palette 
const bloodGroupData = [
    { name: "O+", value: 35, color: "#dc2626" },      // Red-600 - most common, warm
    { name: "A+", value: 28, color: "#ea580c" },      // Orange-600 - second most common
    { name: "B+", value: 20, color: "#ca8a04" },      // Yellow-600 - visible but not harsh
    { name: "AB+", value: 8, color: "#16a34a" },      // Green-600 - fresh, positive
    { name: "O-", value: 5, color: "#2563eb" },       // Blue-600 - universal donor, important
    { name: "A-", value: 2, color: "#7c3aed" },       // Violet-600 - rare, distinctive
    { name: "B-", value: 1.5, color: "#c2410c" },     // Orange-700 - slightly different from A+
    { name: "AB-", value: 0.5, color: "#64748b" },    // Slate-500 - rarest, subtle
]

//  tooltip 
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-background p-3 shadow-md">
                <div className="grid gap-2">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                            {label}
                        </span>
                        {payload.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {entry.name}: {entry.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

//  pie chart tooltip
const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="rounded-lg border bg-background p-3 shadow-md">
                <div className="flex items-center gap-2">
                    <div
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: data.payload.color }}
                    />
                    <span className="text-sm font-medium text-foreground">
                        {data.name}: {data.value}%
                    </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    of total donor population
                </p>
            </div>
        );
    }
    return null;
};

// legend component
const CustomLegend = ({ payload }) => {
    return (
        <div className="flex flex-wrap justify-center gap-3 mt-6">
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                    <div
                        className="h-3 w-3 rounded-sm border border-border/20"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-foreground font-medium">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

//  pie chart label function
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    // Show labels for segments larger than 4% to avoid overcrowding
    if (percent < 0.04) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="text-xs font-semibold drop-shadow-sm"
        >
            {name}
        </text>
    );
};

function Page() {
    return (
        <div className="min-h-screen bg-gray-50/30 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header with improved spacing */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                            Blood Donation Dashboard
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Monitor donations, requests, and blood bank inventory
                        </p>
                    </div>
                </div>

                {/* Stats Cards  */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                Total Users
                            </CardTitle>
                            <Users className="h-5 w-5 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {mockStats.totalUsers.toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                Active Requests
                            </CardTitle>
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {mockStats.activeRequests}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                Blood Bags Available
                            </CardTitle>
                            <Activity className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {mockStats.bloodBagsAvailable}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-rose-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                Donations
                            </CardTitle>
                            <Droplets className="h-5 w-5 text-rose-500"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {mockStats.bloodBagsAvailable}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* Donation Trends Chart  */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl font-semibold">Donation Trends</CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Monthly comparison of donations received vs requests made
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart
                                            data={donationTrends}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#f1f5f9"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="month"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#64748b', fontSize: 12 }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#64748b', fontSize: 12 }}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line
                                                type="monotone"
                                                dataKey="donations"
                                                stroke="#dc2626"
                                                strokeWidth={3}
                                                dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                                                activeDot={{ r: 6, fill: '#dc2626' }}
                                                name="Donations"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="requests"
                                                stroke="#2563eb"
                                                strokeWidth={3}
                                                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                                                activeDot={{ r: 6, fill: '#2563eb' }}
                                                name="Requests"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Blood Group Distribution */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl font-semibold">Blood Group Distribution</CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Current breakdown of registered donors by blood type
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={bloodGroupData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomizedLabel}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                                stroke="#ffffff"
                                                strokeWidth={2}
                                            >
                                                {bloodGroupData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<PieTooltip />} />
                                            <Legend content={<CustomLegend />} />
                                        </PieChart>
                                    </ResponsiveContainer>

                                    {/* Enhanced summary statistics */}
                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
                                            <div className="text-sm font-medium text-red-700 mb-1 flex items-center ">
                                                Most Common Type
                                                <span className="text-2xl font-bold text-red-600 ml-3">O+</span>
                                            </div>
                                            <div className="text-sm text-red-600">
                                                35% of donors
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                                            <div className="text-sm font-medium text-blue-700 mb-1">
                                                Rarest Type
                                                <span className="text-2xl font-bold text-blue-600 ml-3"> AB-</span>
                                            </div>
                                            <div className="text-sm text-blue-600">
                                                0.5% of donors
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Page