'use client';

import QRCode from 'qrcode';
import type React from 'react';
import {
    Droplets,
    Plus,
    Package,
    Trash2,
    CheckCircle,
    Info,
    Beaker,
    Sparkles,
    User,
    Printer,
    X,
    Target,
    TrendingUp,
    Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from '@/hooks/use-account';
import { toast } from 'sonner';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { useAppointment } from '@/hooks/use-appointment';
import { useBloodRequest } from '@/hooks/use-blood-request';
import { DonationForm } from '@/components/donation-form';
import { useDonation } from '@/hooks/use-donation';
import { BloodBag, BloodComponent } from '@/lib/api/dto/blood-bag';
import { useRejectAppointment } from '@/hooks/use-reject-appointment';
import { capitalCase } from 'change-case';

const bloodComponents = [
    {
        value: 'red_cell',
        label: 'Red Blood Cells',
        shelfLife: '42 days',
        icon: Droplets,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
    },
    {
        value: 'platelet',
        label: 'Platelets',
        shelfLife: '5 days',
        icon: Sparkles,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
    },
    {
        value: 'plasma',
        label: 'Plasma',
        shelfLife: '1 year',
        icon: Beaker,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
    },
] as const;

const AccountSection = ({ id }: { id: string }) => {
    const { data: member, isPending, error } = useAccount(id);

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error(error.message);
        return <div></div>;
    }

    return (
        <div className="flex items-center space-x-6">
            <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                    <User className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {member.name}
                </h2>
                <div className="flex items-center space-x-4 mb-3">
                    <Badge className="bg-red-100 text-red-700 border-red-200 px-3 py-1">
                        <Droplets className="h-3 w-3 mr-1" />
                        {bloodGroupLabels[member.blood_group]}
                    </Badge>
                    <span className="text-slate-600 font-medium">
                        {member.gender.charAt(0).toUpperCase() +
                            member.gender.slice(1)}
                        , Age{' '}
                        {new Date().getFullYear() -
                            Number(member.birthday.substring(0, 4))}
                    </span>
                </div>
                <div className="text-sm text-slate-600">
                    {member.phone} • {member.email}
                </div>
            </div>
        </div>
    );
};

const RequestSection = ({ id }: { id: string }) => {
    const { data: request, isPending, error } = useBloodRequest(id);

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error(error.message);
        return <div></div>;
    }

    return (
        <div className="text-right">
            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-center text-red-600 text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="font-medium">Appointment</span>
                </div>
                <div className="text-lg font-bold text-slate-900">
                    {new Date(request.start_time).toLocaleDateString()}
                </div>
                <div className="text-sm text-slate-600">
                    {new Date(request.start_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
                <div className="text-xs text-red-600 mt-2 font-medium">
                    {request.title}
                </div>
            </div>
        </div>
    );
};

export default function DonationCreationPage() {
    const { id } = useParams<{ id: string }>();

    const { data: appointment } = useAppointment(id);
    const { data: donation, isPending, error } = useDonation(appointment?.id);
    const { data: member } = useAccount(appointment?.member_id);
    const [newBloodBag, setNewBloodBag] = useState<BloodBag>({
        amount: 150,
        component: 'red_cell',
        expired_time: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
    });
    const [bloodBags, setBloodBags] = useState<BloodBag[]>([]);
    const reject = useRejectAppointment(id);

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error(error.name);

        return <div></div>;
    }

    const addBloodBag = () => {
        if (newBloodBag.amount > 0) {
            setBloodBags((prev) => [...prev, { ...newBloodBag }]);

            const component = bloodComponents.find(
                (c) => c.value === newBloodBag.component,
            );
            const defaultExpiry =
                component?.value === 'red_cell'
                    ? 42
                    : component?.value === 'platelet'
                      ? 5
                      : 365;
            setNewBloodBag({
                amount: 150,
                component: 'red_cell',
                expired_time: new Date(
                    Date.now() + defaultExpiry * 24 * 60 * 60 * 1000,
                ),
            });
        }
    };

    const removeBloodBag = (index: number) => {
        setBloodBags((prev) => prev.filter((_, i) => i !== index));
    };

    const handleComponentChange = (component: BloodComponent) => {
        const defaultExpiry =
            component === 'red_cell' ? 42 : component === 'platelet' ? 5 : 365;
        setNewBloodBag((prev) => ({
            ...prev,
            component,
            expired_time: new Date(
                Date.now() + defaultExpiry * 24 * 60 * 60 * 1000,
            ),
        }));
    };

    const handleCompleteDonation = async (e: React.FormEvent) => {
        e.preventDefault();

        toast.info('success');
    };

    const totalBagAmount = bloodBags.reduce((sum, bag) => sum + bag.amount, 0);
    const completionProgress =
        (donation?.amount ?? 0) > 0
            ? Math.min((totalBagAmount / donation.amount) * 100, 100)
            : 0;

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Enhanced Patient Info */}
            <Card className="mb-8 border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                        <AccountSection id={appointment!.member_id} />
                        <RequestSection id={appointment!.request_id} />
                    </div>
                </CardContent>
            </Card>

            {donation === null ? (
                <DonationForm appointmentId={id} />
            ) : (
                <div className="space-y-8">
                    {/* Enhanced Donation Summary */}
                    <Card className="border-0 shadow-xl shadow-blue-200/30 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <CardHeader className="border-b border-blue-200/50">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/25">
                                        <TrendingUp className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-xl font-bold text-slate-900">
                                            Donation Record
                                        </span>
                                        <div className="text-sm text-slate-600 mt-1">
                                            Created:{' '}
                                            {new Date(
                                                donation.created_at,
                                            ).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    'Are you sure you want to reject this donation? This action cannot be undone.',
                                                )
                                            ) {
                                                reject.mutate();
                                            }
                                        }}
                                        className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Reject Donation
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="bg-white/80 hover:bg-white"
                                        onClick={async () => {
                                            // Create a popup window with just the donation information
                                            const printWindow = window.open(
                                                '',
                                                '_blank',
                                            );
                                            if (printWindow) {
                                                const url =
                                                    await QRCode.toDataURL(
                                                        window.location.href,
                                                    );
                                                printWindow.document.write(`
                            <html>
                              <head>
                                <title>Blood Donation Label - ${donation.id}</title>
                                <style>
                                  body { 
                                    font-family: 'Arial', sans-serif; 
                                    margin: 0; 
                                    padding: 20px; 
                                    background: #f8f9fa;
                                  }
                                  .label { 
                                    background: white;
                                    border: 2px solid #dc2626; 
                                    border-radius: 12px;
                                    padding: 24px; 
                                    max-width: 500px; 
                                    margin: 0 auto;
                                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                                  }
                                  .header { 
                                    text-align: center;
                                    background: linear-gradient(135deg, #dc2626, #ef4444);
                                    color: white;
                                    padding: 16px;
                                    margin: -24px -24px 20px -24px;
                                    border-radius: 10px 10px 0 0;
                                    font-size: 24px; 
                                    font-weight: bold;
                                  }
                                  .content {
                                    display: grid;
                                    grid-template-columns: 1fr auto;
                                    gap: 20px;
                                    align-items: start;
                                  }
                                  .info-section {
                                    display: grid;
                                    gap: 12px;
                                  }
                                  .info-row { 
                                    display: flex;
                                    justify-content: space-between;
                                    padding: 8px 0;
                                    border-bottom: 1px solid #e5e7eb;
                                  }
                                  .info-row:last-child {
                                    border-bottom: none;
                                  }
                                  .label-text { 
                                    font-weight: 600;
                                    color: #374151;
                                    min-width: 120px;
                                  }
                                  .value-text { 
                                    font-weight: 700;
                                    color: #111827;
                                  }
                                  .qr-section {
                                    text-align: center;
                                    padding: 16px;
                                    background: #f9fafb;
                                    border-radius: 8px;
                                    border: 1px solid #e5e7eb;
                                  }
                                  .qr-code {
                                    margin-bottom: 8px;
                                  }
                                  .qr-label {
                                    font-size: 10px;
                                    color: #6b7280;
                                    font-weight: 500;
                                  }
                                  .blood-type {
                                    background: #fef2f2;
                                    color: #dc2626;
                                    padding: 8px 16px;
                                    border-radius: 20px;
                                    font-weight: bold;
                                    font-size: 18px;
                                    display: inline-block;
                                    border: 2px solid #fecaca;
                                  }
                                  .footer {
                                    margin-top: 20px;
                                    padding-top: 16px;
                                    border-top: 2px solid #e5e7eb;
                                    text-align: center;
                                    font-size: 12px;
                                    color: #6b7280;
                                  }
                                  .urgent {
                                    background: #fef3c7;
                                    color: #d97706;
                                    padding: 8px 12px;
                                    border-radius: 6px;
                                    font-weight: 600;
                                    text-align: center;
                                    margin-bottom: 16px;
                                    border: 1px solid #fbbf24;
                                  }
                                  @media print {
                                    body { background: white; }
                                    .label { box-shadow: none; }
                                  }
                                </style>
                              </head>
                              <body>
                                <div class="label">
                                  <div class="header">
                                    🩸 BLOOD DONATION LABEL
                                  </div>
                                  
                                  <div class="urgent">
                                    ⚠️ HANDLE WITH CARE - BIOLOGICAL MATERIAL
                                  </div>
                                  
                                  <div class="content">
                                    <div class="info-section">
                                      <div class="info-row">
                                        <span class="label-text">Donation ID:</span>
                                        <span class="value-text">${donation.id || 'N/A'}</span>
                                      </div>
                                      <div class="info-row">
                                        <span class="label-text">Type:</span>
                                        <span class="value-text">${capitalCase(donation.type) || 'N/A'}</span>
                                      </div>
                                      <div class="info-row">
                                        <span class="label-text">Volume:</span>
                                        <span class="value-text">${donation.amount}ml</span>
                                      </div>
                                      <div class="info-row">
                                        <span class="label-text">Donor:</span>
                                        <span class="value-text">${member!.name}</span>
                                      </div>
                                      <div class="info-row">
                                        <span class="label-text">Blood Group:</span>
                                        <span class="blood-type">${bloodGroupLabels[member!.blood_group]}</span>
                                      </div>
                                      <div class="info-row">
                                        <span class="label-text">Collection Date:</span>
                                        <span class="value-text">${new Date().toLocaleDateString()}</span>
                                      </div>
                                      <div class="info-row">
                                        <span class="label-text">Collection Time:</span>
                                        <span class="value-text">${new Date().toLocaleTimeString()}</span>
                                      </div>
                                      <div class="info-row">
                                        <span class="label-text">Expiry Date:</span>
                                        <span class="value-text">${new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                    
                                    <div class="qr-section">
                                      <div class="qr-code">
                                        <img id='qrcode' src="${url}" alt="QR Code" style="width: 120; height: 120">
                                      </div>
                                      <div class="qr-label">Scan for Details</div>
                                    </div>
                                  </div>
                                  
                                  <div class="footer">
                                    <strong>LifeLink Blood Donation Network</strong><br>
                                    Generated: ${new Date().toLocaleString()}<br>
                                    Staff ID: ${member!.email}
                                  </div>
                                </div>
                                
                              </body>
                            </html>
                          `);
                                                printWindow.document.close();
                                                printWindow.focus();
                                            }
                                        }}
                                    >
                                        <Printer className="h-4 w-4 mr-2" />
                                        Print Label
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-900 mb-2">
                                        {capitalCase(donation.type)}
                                    </div>
                                    <div className="text-slate-600">
                                        Donation Type
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-900 mb-2">
                                        {donation.amount}ml
                                    </div>
                                    <div className="text-slate-600">
                                        Collection Volume
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-900 mb-2">
                                        {bloodBags.length}
                                    </div>
                                    <div className="text-slate-600">
                                        Components
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-900 mb-2">
                                        {totalBagAmount}ml
                                    </div>
                                    <div className="text-slate-600">
                                        Total Processed
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-700">
                                        Collection Progress
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        {Math.round(completionProgress)}%
                                    </span>
                                </div>
                                <Progress
                                    value={completionProgress}
                                    className="h-3 bg-blue-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-600"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Enhanced Blood Components Management */}
                    <Card className="border-0 shadow-xl shadow-slate-200/50">
                        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-200/50">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-500/25">
                                        <Package className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-xl font-bold text-slate-900">
                                            Blood Components
                                        </span>
                                        <div className="text-sm text-slate-600 mt-1">
                                            Add and manage blood components
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {bloodBags.length > 0 && (
                                        <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            {bloodBags.length} component
                                            {bloodBags.length !== 1 ? 's' : ''}
                                        </Badge>
                                    )}
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            {/* Enhanced Add Component Form */}
                            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 mb-8 border border-slate-200">
                                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                                    Add New Component
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <Label className="text-sm font-medium text-slate-700 mb-3 block">
                                            Component Type
                                        </Label>
                                        <Select
                                            value={newBloodBag.component}
                                            onValueChange={(
                                                value: BloodComponent,
                                            ) => handleComponentChange(value)}
                                        >
                                            <SelectTrigger className="h-12 border-2 rounded-xl transition-all">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bloodComponents.map(
                                                    (component) => {
                                                        const Icon =
                                                            component.icon;
                                                        return (
                                                            <SelectItem
                                                                key={
                                                                    component.value
                                                                }
                                                                value={
                                                                    component.value
                                                                }
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <Icon
                                                                        className={`h-5 w-5 ${component.color}`}
                                                                    />
                                                                    <span>
                                                                        {
                                                                            component.label
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        );
                                                    },
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-slate-700 mb-3 block">
                                            Amount (ml)
                                        </Label>
                                        <Input
                                            type="number"
                                            value={newBloodBag.amount}
                                            onChange={(e) =>
                                                setNewBloodBag((prev) => ({
                                                    ...prev,
                                                    amount: Number.parseInt(
                                                        e.target.value,
                                                    ),
                                                }))
                                            }
                                            min="50"
                                            max="500"
                                            placeholder="150"
                                            className="h-12 text-center text-lg font-semibold border-2 rounded-xl transition-all"
                                        />
                                    </div>

                                    <div className="flex items-end">
                                        <Button
                                            type="button"
                                            onClick={addBloodBag}
                                            disabled={newBloodBag.amount <= 0}
                                            className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all transform hover:scale-105"
                                        >
                                            <Plus className="h-5 w-5 mr-2" />
                                            Add Component
                                        </Button>
                                    </div>
                                </div>

                                <Alert className="mt-6 border-blue-200 bg-blue-50 rounded-xl">
                                    <Info className="h-5 w-5 text-blue-600" />
                                    <AlertDescription className="text-blue-800">
                                        {
                                            bloodComponents.find(
                                                (c) =>
                                                    c.value ===
                                                    newBloodBag.component,
                                            )?.label
                                        }{' '}
                                        has a shelf life of{' '}
                                        <strong>
                                            {
                                                bloodComponents.find(
                                                    (c) =>
                                                        c.value ===
                                                        newBloodBag.component,
                                                )?.shelfLife
                                            }
                                        </strong>
                                        .
                                    </AlertDescription>
                                </Alert>
                            </div>

                            {/* Enhanced Components List */}
                            {bloodBags.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-slate-900">
                                            Added Components ({bloodBags.length}
                                            )
                                        </h3>
                                        <span className="text-slate-600 font-medium">
                                            Total: {totalBagAmount}ml
                                        </span>
                                    </div>
                                    {bloodBags.map((bag, index) => {
                                        const component = bloodComponents.find(
                                            (c) => c.value === bag.component,
                                        );
                                        const Icon = component?.icon || Package;
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-6 bg-white border-2 border-slate-200 rounded-2xl hover:border-slate-300 transition-all hover:shadow-lg"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div
                                                        className={`p-3 ${component?.bgColor} rounded-xl`}
                                                    >
                                                        <Icon
                                                            className={`h-6 w-6 ${component?.color}`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-semibold text-slate-900">
                                                            {component?.label}
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            {bag.amount}
                                                            ml • Expires:{' '}
                                                            {bag.expired_time.toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeBloodBag(index)
                                                    }
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-dashed border-slate-300 rounded-2xl">
                                    <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                        No components added yet
                                    </h3>
                                    <p className="text-slate-600">
                                        Add blood components after collection
                                        and processing
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Enhanced Complete Donation */}
                    {bloodBags.length > 0 && (
                        <Card className="border-0 shadow-xl shadow-green-200/30 bg-gradient-to-br from-green-50 to-emerald-50">
                            <CardHeader className="border-b border-green-200/50">
                                <CardTitle className="flex items-center space-x-3">
                                    <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-500/25">
                                        <Target className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-xl font-bold text-slate-900">
                                            Complete Donation
                                        </span>
                                        <div className="text-sm text-slate-600 mt-1">
                                            Finalize the donation process
                                        </div>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="bg-white/80 rounded-2xl p-6 mb-8 border border-green-200">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                        <div>
                                            <div className="text-3xl font-bold text-slate-900 mb-1">
                                                {capitalCase(donation.type)}
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                Type
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-slate-900 mb-1">
                                                {donation.amount}ml
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                Volume
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-slate-900 mb-1">
                                                {bloodBags.length}
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                Components
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-slate-900 mb-1">
                                                {totalBagAmount}ml
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                Total Components
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Alert className="mb-8 border-green-200 bg-green-50 rounded-xl">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <AlertDescription className="text-green-800 font-medium">
                                        Ready to complete donation processing.
                                        All required information has been
                                        collected and verified.
                                    </AlertDescription>
                                </Alert>

                                <div className="flex justify-center">
                                    <Button
                                        onClick={handleCompleteDonation}
                                        className="px-12 py-4 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl shadow-green-500/25 rounded-2xl transition-all transform hover:scale-105"
                                    >
                                        <CheckCircle className="h-6 w-6 mr-3" />
                                        Complete Donation
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
