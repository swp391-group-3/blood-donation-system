'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Activity,
    Thermometer,
    Weight,
    CheckCircle,
    Shield,
    Droplets,
    User,
    XCircle,
    Check,
    X,
} from 'lucide-react';
import { useCurrentAccountHealth } from '@/hooks/use-current-account-health';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { Health } from '@/lib/api/dto/health';
import { cn } from '@/lib/utils';

const HealthCard = (health: Health) => {
    return (
        <Card className="border-slate-200 rounded-2xl hover:shadow-lg transition-all duration-200 overflow-hidden">
            <CardHeader>
                <CardTitle className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                    <div className="flex items-center gap-4 mb-4 lg:mb-0">
                        <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                                health.is_good_health
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-rose-100 text-rose-600'
                            }`}
                        >
                            {health.is_good_health ? (
                                <CheckCircle className="h-7 w-7" />
                            ) : (
                                <XCircle className="h-7 w-7" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">
                                {new Date(health.created_at).toLocaleDateString(
                                    'en-US',
                                    {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    },
                                )}
                            </h3>
                            <div className="flex items-center gap-3">
                                <p className="text-slate-600">
                                    Appointment {health.appointment_id}
                                </p>
                                <Badge
                                    className={cn(
                                        'font-medium',
                                        health.is_good_health
                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                            : 'bg-rose-100 text-red-800 border-rose-200',
                                    )}
                                >
                                    {health.is_good_health ? (
                                        <>
                                            <Check /> Approved
                                        </>
                                    ) : (
                                        <>
                                            <X /> Disapproved
                                        </>
                                    )}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex">
                    <div className="flex-1 p-6">
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Thermometer className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-slate-900">
                                        {health.temperature}
                                        °C
                                    </div>
                                    <div className="text-xs text-slate-600">
                                        Temperature
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Weight className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-slate-900">
                                        {health.weight}
                                        kg
                                    </div>
                                    <div className="text-xs text-slate-600">
                                        Weight
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Activity className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-slate-900">
                                        {health.upper_blood_pressure}/
                                        {health.lower_blood_pressure}
                                    </div>
                                    <div className="text-xs text-slate-600">
                                        Blood Pressure
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl border border-rose-100">
                                <div className="p-2 bg-rose-100 rounded-lg">
                                    <Activity className="h-5 w-5 text-rose-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-slate-900">
                                        {health.heart_pulse}
                                    </div>
                                    <div className="text-xs text-slate-600">
                                        Heart Rate
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <Droplets className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-slate-900">
                                        {health.hemoglobin}
                                    </div>
                                    <div className="text-xs text-slate-600">
                                        Hemoglobin
                                    </div>
                                </div>
                            </div>
                        </div>

                        {health.note && (
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-200 rounded-lg mt-0.5">
                                        <User className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-slate-700 mb-2">
                                            Medical Assessment
                                        </div>
                                        <p className="text-slate-600 leading-relaxed">
                                            {health.note}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function HealthPage() {
    const { data: healths, isPending, error } = useCurrentAccountHealth();
    const approvedCount = useMemo(
        () => healths?.filter((health) => health.is_good_health).length ?? 0,
        [healths],
    );

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error('Login to use this feature');
        redirect('/auth/login');
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <section className="bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-6">
                            <Shield className="h-4 w-4 mr-2" />
                            Health Monitoring
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                            Your Health
                            <span className="block text-emerald-600">
                                Dashboard
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                            Monitor your health status and donation eligibility
                        </p>
                    </div>
                </div>
            </section>
            <div className="mb-8">
                <Card
                    className={cn(
                        'flex flex-col md:flex-row md:items-center gap-8 border-0 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-gradient-to-br relative',
                        healths[0].is_good_health
                            ? 'from-emerald-50 via-white to-teal-50'
                            : 'from-rose-50 via-white to-red-50',
                    )}
                >
                    <CardHeader className="flex-1 p-8">
                        <CardTitle>
                            {healths[0].is_good_health ? (
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                            <Shield className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                            <CheckCircle className="h-4 w-4 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-900 mb-1">
                                            Excellent Health
                                        </h2>
                                        <p className="text-slate-600 text-lg">
                                            You&apos;re in great shape for
                                            donation
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                            <Shield className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                                            <XCircle className="h-4 w-4 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-900 mb-1">
                                            Bad Health
                                        </h2>
                                        <p className="text-slate-600 text-lg">
                                            You&apos;re not in good condition
                                            for donation
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-4">
                                {healths[0].is_good_health ? (
                                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-4 py-2 text-sm font-semibold">
                                        <Check /> Donation Eligible
                                    </Badge>
                                ) : (
                                    <Badge className="bg-rose-100 text-red-800 border-rose-200 px-4 py-2 text-sm font-semibold">
                                        <X /> Not Eligible for Donation
                                    </Badge>
                                )}
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2 text-sm font-semibold">
                                    {approvedCount}/{healths.length} Approved
                                </Badge>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 relative">
                        <div className="lg:w-80">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                    Latest Vitals
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
                                        <Thermometer className="h-5 w-5 text-red-600 mx-auto mb-2" />
                                        <div className="text-lg font-bold text-slate-900">
                                            {healths[0].temperature}°C
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            Temperature
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                                        <Weight className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                                        <div className="text-lg font-bold text-slate-900">
                                            {healths[0].weight}kg
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            Weight
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                                        <Activity className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                                        <div className="text-lg font-bold text-slate-900">
                                            {healths[0].upper_blood_pressure}/
                                            {healths[0].lower_blood_pressure}
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            Blood Pressure
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                                        <Droplets className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
                                        <div className="text-lg font-bold text-slate-900">
                                            {healths[0].hemoglobin}
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            Hemoglobin
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-5 w-5 text-rose-600" />
                                            <span className="text-sm font-medium text-slate-700">
                                                Heart Rate
                                            </span>
                                        </div>
                                        <div className="text-xl font-bold text-slate-900">
                                            {healths[0].heart_pulse} bpm
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <div className="items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">
                        Health Records
                    </h2>
                    <p className="text-slate-600">
                        Your complete health history timeline
                    </p>
                </div>
            </div>

            <div className="space-y-10">
                {healths.map((health) => (
                    <HealthCard key={health.id} {...health} />
                ))}
            </div>
        </div>
    );
}
