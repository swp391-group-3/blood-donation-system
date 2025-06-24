"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent} from "@/components/ui/tabs"
import {
    Users,
    Droplets,
    Calendar,
    Activity,
    AlertTriangle,
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
} from "recharts"

// Mock data - replace with actual API calls
const mockStats = {
    totalUsers: 1247,
    activeRequests: 23,
    todayDonations: 8,
    bloodBagsAvailable: 156,
    pendingAppointments: 45,
}

const donationTrends = [
    { month: "Jan", donations: 65, requests: 45 },
    { month: "Feb", donations: 78, requests: 52 },
    { month: "Mar", donations: 90, requests: 48 },
    { month: "Apr", donations: 81, requests: 61 },
    { month: "May", donations: 95, requests: 55 },
    { month: "Jun", donations: 87, requests: 67 },
]

const bloodGroupData = [
    { name: "O+", value: 35, color: "#ef4444" },
    { name: "A+", value: 28, color: "#f97316" },
    { name: "B+", value: 20, color: "#eab308" },
    { name: "AB+", value: 8, color: "#22c55e" },
    { name: "O-", value: 5, color: "#3b82f6" },
    { name: "A-", value: 2, color: "#8b5cf6" },
    { name: "B-", value: 1.5, color: "#ec4899" },
    { name: "AB-", value: 0.5, color: "#6b7280" },
]



function Page() {

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blood Donation Admin Dashboard</h1>
                    </div>
                </div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">+12%</span> from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.activeRequests}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-red-600">+3</span> urgent requests
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today's Donations</CardTitle>
                            <Droplets className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.todayDonations}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">+2</span> from yesterday
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Blood Bags Available</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.bloodBagsAvailable}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-yellow-600">-5</span> from last week
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.pendingAppointments}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-blue-600">+8</span> this week
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Donation Trends Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Donation Trends</CardTitle>
                                    <CardDescription>Monthly donations vs requests</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={donationTrends}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="donations" stroke="#ef4444" strokeWidth={2} />
                                            <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Blood Group Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Blood Group Distribution</CardTitle>
                                    <CardDescription>Current donor distribution by blood type</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={bloodGroupData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, value }) => `${name}: ${value}%`}
                                            >
                                                {bloodGroupData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
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