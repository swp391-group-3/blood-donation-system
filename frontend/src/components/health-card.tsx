import { Health } from '@/lib/api/dto/health';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
    Activity,
    Check,
    CheckCircle,
    Droplets,
    Thermometer,
    User,
    Weight,
    X,
    XCircle,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

export const HealthCard = (health: Health) => {
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
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                                        {health.heart_rate}
                                    </div>
                                    <div className="text-xs text-slate-600">
                                        Heart Rate
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
