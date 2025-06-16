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
import {
    Calendar,
    Droplet,
    MapPin,
    Search,
    Filter,
    Download,
    Award,
    Heart,
    TrendingUp,
    CheckCircle,
    FileText,
} from 'lucide-react';
import { donationHistory } from '../../../constants/sample-data';

export default function MemberHistoryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [year, setYear] = useState('');
    const [type, setType] = useState('');
    const [selectedHistory, setSelectedHistory] = useState<string | null>(null);

    function handleSearch() {
        // come in future
    }

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'Critical':
                return 'bg-red-500';
            case 'High':
                return 'bg-orange-500';
            case 'Medium':
                return 'bg-yellow-500';
            default:
                return 'bg-green-500';
        }
    };

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

            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
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
                                    5
                                </div>
                                <div className="text-sm text-zinc-600">
                                    Total Donations
                                </div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-3xl font-bold text-blue-600 mb-1">
                                    2.25L
                                </div>
                                <div className="text-sm text-zinc-600">
                                    Blood Donated
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex w-full items-center gap-2">
                <div className="relative w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <Input
                        type="search"
                        placeholder="Search by name"
                        className="pl-9 w-full h-10"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            handleSearch();
                        }}
                    />
                </div>
                <Select
                    onValueChange={(value) => {
                        setYear(value);
                        handleSearch();
                    }}
                >
                    <SelectTrigger className="w-[180px] h-10">
                        <Calendar className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    onValueChange={(value) => {
                        setType(value);
                        handleSearch();
                    }}
                >
                    <SelectTrigger className="w-[180px] h-10">
                        <Droplet className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Blood Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="timeline" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline">
                    <div className="space-y-4">
                        {donationHistory.map((donation, index) => (
                            <Card
                                key={donation.id}
                                className={
                                    'transition-colors cursor-pointer shadow' +
                                    (selectedHistory === donation.id
                                        ? 'border-primary/60 shadow-lg'
                                        : 'hover:bg-muted/30')
                                }
                                onClick={() =>
                                    setSelectedHistory(
                                        selectedHistory === donation.id
                                            ? null
                                            : donation.id,
                                    )
                                }
                            >
                                <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
                                    <div>
                                        <div className="flex flex-row gap-4">
                                            <CardTitle className="text-base">
                                                {donation.type}
                                            </CardTitle>
                                            <Badge variant="outline">
                                                {donation.amount}
                                            </Badge>
                                            <Badge
                                                className={getUrgencyColor(
                                                    donation.urgency,
                                                )}
                                            >
                                                {donation.urgency}
                                            </Badge>
                                        </div>
                                        <CardDescription className="flex flex-row pt-4 gap-5">
                                            <div className="flex flex-row gap-3">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {' '}
                                                    {new Date(
                                                        donation.date,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex flex-row gap-2">
                                                <CheckCircle className="h-4 w-4" />
                                                <span>
                                                    Hemoglobin:{' '}
                                                    {donation.hemoglobin}
                                                </span>
                                            </div>
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge
                                            variant="outline"
                                            className="bg-green-100 text-green-800 border-green-200"
                                        >
                                            Complete
                                        </Badge>
                                        <Button variant="outline" size="sm">
                                            <Download className="mr-1 h-3 w-3" />
                                            View Certificate
                                        </Button>
                                    </div>
                                </CardHeader>
                                {selectedHistory === donation.id && (
                                    <CardContent>
                                        <div className="grid gap-4 md:grid-cols-1 border-t pt-4">
                                            <div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span>
                                                            Donation ID:
                                                        </span>
                                                        <span>don-001</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>
                                                            Appointment ID:
                                                        </span>
                                                        <span>app-001</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Type:</span>
                                                        <span>Whole Blood</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Amount:</span>
                                                        <span>450ml</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="border-t pt-4 flex justify-between">
                                                <h4 className="font-medium mb-2">
                                                    Medical Notes
                                                </h4>
                                                <p className="text-sm text-zinc-600">
                                                    The donor have a little bit
                                                    of headache after donation
                                                    process
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                {/* Come in future */}
                <TabsContent value="summary">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Donation Types</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[
                                        'Whole Blood',
                                        'Plasma',
                                        'Platelets',
                                        'Double Red Cells',
                                    ].map((type) => {
                                        const count = donationHistory.filter(
                                            (d) => d.type === type,
                                        ).length;
                                        const percentage = (count / 10) * 100;
                                        return (
                                            <div key={type}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>{type}</span>
                                                    <span>
                                                        {count} donations
                                                    </span>
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

                        <Card>
                            <CardHeader>
                                <CardTitle>Yearly Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {['2025', '2024', '2023'].map((year) => {
                                        const count = donationHistory.filter(
                                            (d) =>
                                                new Date(d.date)
                                                    .getFullYear()
                                                    .toString() === year,
                                        ).length;
                                        const volume = donationHistory
                                            .filter(
                                                (d) =>
                                                    new Date(d.date)
                                                        .getFullYear()
                                                        .toString() === year,
                                            )
                                            .reduce(
                                                (sum, d) =>
                                                    sum +
                                                    Number.parseInt(
                                                        d.amount.replace(
                                                            'ml',
                                                            '',
                                                        ),
                                                    ),
                                                0,
                                            );
                                        return (
                                            <div
                                                key={year}
                                                className="p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">
                                                        {year}
                                                    </span>
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium">
                                                            {count} donations
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {volume}ml total
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
