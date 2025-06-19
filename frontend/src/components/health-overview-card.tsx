import { Health } from '@/lib/api/dto/health';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
    Activity,
    Check,
    CheckCircle,
    Droplets,
    Shield,
    Thermometer,
    Weight,
    X,
    XCircle,
} from 'lucide-react';

export const HealthOverviewCard = ({ healths }: { healths: Health[] }) => {
    const approvedCount = healths.filter(
        (health) => health.is_good_health,
    ).length;

    return (
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
                                    You&apos;re in great shape for donation
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
                                    You&apos;re not in good condition for
                                    donation
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
    );
};
