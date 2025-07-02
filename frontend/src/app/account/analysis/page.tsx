"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useGetAllAccounts } from "@/hooks/use-get-all-account";
import { useGetAllBloodBag } from "@/hooks/use-get-all-blood-bag";
import { useGetAllDonation } from "@/hooks/use-get-all-donation";
import { useGetAllRequest } from "@/hooks/use-get-all-request";
import { BloodRequest } from "@/lib/api/dto/blood-request";
import { getTrendData } from "@/lib/dashboard-utils";
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

interface LabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    name: string;
}

// mock blood request
const sampleBloodRequests: BloodRequest[] = [
    {
        id: "11111111-aaaa-bbbb-cccc-000000000001",
        priority: "low",
        title: "Emergency O− for trauma unit",
        blood_groups: ["o_plus"],
        current_people: 2,
        max_people: 10,
        start_time: new Date("2025-06-18T08:00:00Z"),
        end_time: new Date("2025-06-18T12:00:00Z"),
    },
    {
        id: "22222222-aaaa-bbbb-cccc-000000000002",
        priority: 'medium',
        title: "Routine A+ donor drive",
        blood_groups: ["a_plus"],
        current_people: 5,
        max_people: 15,
        start_time: new Date("2025-07-01T09:00:00Z"),
        end_time: new Date("2025-07-01T13:00:00Z"),
    },
    {
        id: "33333333-aaaa-bbbb-cccc-000000000003",
        priority: 'high',
        title: "Platelet (B+) for oncology",
        blood_groups: ["b_plus"],
        current_people: 1,
        max_people: 8,
        start_time: new Date("2025-07-10T07:30:00Z"),
        end_time: new Date("2025-07-10T11:30:00Z"),
    },
    {
        id: "44444444-aaaa-bbbb-cccc-000000000004",
        priority: 'high',
        title: "AB− registry topping up",
        blood_groups: ["a_b_minus"],
        current_people: 3,
        max_people: 5,
        start_time: new Date("2025-08-05T10:00:00Z"),
        end_time: new Date("2025-08-05T14:00:00Z"),
    },
    {
        id: "55555555-aaaa-bbbb-cccc-000000000005",
        priority: 'medium',
        title: "Mixed group community drive",
        blood_groups: ["a_plus", "o_plus", "b_plus", "a_b_plus"],
        current_people: 12,
        max_people: 20,
        start_time: new Date("2025-08-20T08:30:00Z"),
        end_time: new Date("2025-08-20T12:30:00Z"),
    },
];


// Updated color palette 
const bloodGroupData = [
    { name: "O+", value: 35, color: "#dc2626" },
    { name: "A+", value: 28, color: "#ea580c" },
    { name: "B+", value: 20, color: "#ca8a04" },
    { name: "AB+", value: 8, color: "#16a34a" },
    { name: "O-", value: 5, color: "#2563eb" },
    { name: "A-", value: 2, color: "#7c3aed" },
    { name: "B-", value: 1.5, color: "#c2410c" },
    { name: "AB-", value: 0.5, color: "#64748b" },
]



const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name
}: Partial<LabelProps>) => {

    if (
        percent === undefined ||
        midAngle === undefined ||
        cx === undefined ||
        cy === undefined ||
        innerRadius === undefined ||
        outerRadius === undefined
    ) {
        return null;
    }

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
    const { data: accounts } = useGetAllAccounts();
    const { data: bloodRequests } = useGetAllRequest();
    const { data: donations = [] } = useGetAllDonation();
    const { data: bloodBags } = useGetAllBloodBag();
    const dataTrend = getTrendData(donations, sampleBloodRequests);

    const stats = {
        totalUsers: accounts?.length,
        activeRequests: bloodRequests?.length,
        donations: donations?.length,
        bloodBagsAvailable: bloodBags?.length,
    }
    return (
        <div className="min-h-screen bg-gray-50/30 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
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
                {/* STATS */}
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
                                {stats.totalUsers?.toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-rose-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                Donations
                            </CardTitle>
                            <Droplets className="h-5 w-5 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {stats.donations}
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
                                {stats.activeRequests}
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
                                {stats.bloodBagsAvailable}
                            </div>
                        </CardContent>
                    </Card>

                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
                                            data={dataTrend}
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
                                            <Tooltip />
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
                                            <Tooltip />
                                            <Legend
                                                layout="horizontal"
                                                verticalAlign="bottom"
                                                iconType="circle"
                                                iconSize={16}
                                                content={({ payload }) => (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            flexWrap: "wrap",
                                                            gap: "12px",
                                                            paddingTop: "16px"
                                                        }}
                                                    >
                                                        {payload?.map((entry, index) => (
                                                            <div
                                                                key={`legend-item-${index}`}
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    fontSize: "16px",
                                                                    color: "#333"
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        width: 14,
                                                                        height: 14,
                                                                        borderRadius: "50%",
                                                                        backgroundColor: entry.color,
                                                                        marginRight: 6
                                                                    }}
                                                                ></div>
                                                                {entry.value}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>

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