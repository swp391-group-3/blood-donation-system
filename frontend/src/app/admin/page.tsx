'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useBloodRequestList } from '@/hooks/use-blood-request-list';
import { useAllAccounts } from '@/hooks/use-all-account';
import { useAllBloodBag } from '@/hooks/use-all-blood-bag';
import { useAllDonation } from '@/hooks/use-all-donation';
import {
    getBloodGroupData,
    getTrendData,
    LabelProps,
} from '@/lib/dashboard-utils';
import { Users, Activity, AlertTriangle, Droplets } from 'lucide-react';
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
} from 'recharts';

const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
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
    const { data: accounts = [] } = useAllAccounts();
    const { data: bloodRequests = [] } = useBloodRequestList();
    const { data: donations = [] } = useAllDonation();
    const { data: bloodBags } = useAllBloodBag();
    const dataTrend = getTrendData(donations, bloodRequests);
    const bloodGroupData = getBloodGroupData(accounts).sort(
        (a, b) => b.value - a.value,
    );

    const stats = {
        totalUsers: accounts?.length,
        activeRequests: bloodRequests?.length,
        donations: donations?.length,
        bloodBagsAvailable: bloodBags?.filter(bg => !bg.is_used).length,
    };


    return (
        <div className="min-h-screen bg-gray-50/30 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                            Blood Donation Dashboard
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Monitor donations, requests, and blood bank
                            inventory
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
                                    <CardTitle className="text-xl font-semibold">
                                        Donation Trends
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Monthly comparison of donations received
                                        vs requests made
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <LineChart
                                            data={dataTrend}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
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
                                                tick={{
                                                    fill: '#64748b',
                                                    fontSize: 12,
                                                }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fill: '#64748b',
                                                    fontSize: 12,
                                                }}
                                            />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="donations"
                                                stroke="#dc2626"
                                                strokeWidth={3}
                                                dot={{
                                                    fill: '#dc2626',
                                                    strokeWidth: 2,
                                                    r: 4,
                                                }}
                                                activeDot={{
                                                    r: 6,
                                                    fill: '#dc2626',
                                                }}
                                                name="Donations"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="requests"
                                                stroke="#2563eb"
                                                strokeWidth={3}
                                                dot={{
                                                    fill: '#2563eb',
                                                    strokeWidth: 2,
                                                    r: 4,
                                                }}
                                                activeDot={{
                                                    r: 6,
                                                    fill: '#2563eb',
                                                }}
                                                name="Requests"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl font-semibold">
                                        Blood Group Distribution
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Current breakdown of registered donors
                                        by blood type
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
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
                                                {bloodGroupData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                        />
                                                    ),
                                                )}
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
                                                            display: 'flex',
                                                            justifyContent:
                                                                'center',
                                                            flexWrap: 'wrap',
                                                            gap: '12px',
                                                            paddingTop: '16px',
                                                        }}
                                                    >
                                                        {payload?.map(
                                                            (entry, index) => (
                                                                <div
                                                                    key={`legend-item-${index}`}
                                                                    style={{
                                                                        display:
                                                                            'flex',
                                                                        alignItems:
                                                                            'center',
                                                                        fontSize:
                                                                            '16px',
                                                                        color: '#333',
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            width: 14,
                                                                            height: 14,
                                                                            borderRadius:
                                                                                '50%',
                                                                            backgroundColor:
                                                                                entry.color,
                                                                            marginRight: 6,
                                                                        }}
                                                                    ></div>
                                                                    {
                                                                        entry.value
                                                                    }
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
                                            <div className="text-sm font-medium text-red-700 mb-1 flex items-center ">
                                                Most Common Type
                                                <span className="text-2xl font-bold text-red-600 ml-3">
                                                    {bloodGroupData[0].name}
                                                </span>
                                            </div>
                                            <div className="text-sm text-red-600">
                                                {(
                                                    (bloodGroupData[0].value /
                                                        accounts.length) *
                                                    100
                                                ).toFixed(2)}
                                                %
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                                            <div className="text-sm font-medium text-blue-700 mb-1">
                                                Rarest Type
                                                <span className="text-2xl font-bold text-blue-600 ml-3">
                                                    {bloodGroupData[1].name}
                                                </span>
                                            </div>
                                            <div className="text-sm text-blue-600">
                                                {(
                                                    (bloodGroupData[1].value /
                                                        accounts.length) *
                                                    100
                                                ).toFixed(2)}
                                                %
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
    );
}

export default Page;
