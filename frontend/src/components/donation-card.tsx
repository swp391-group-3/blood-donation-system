import { displayDonationType, Donation } from '@/lib/api/dto/donation';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Clock, Droplets, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { formatDateTime } from '@/lib/utils';

const donationTypeConfig = {
    whole_blood: {
        color: 'rose',
    },
    power_red: {
        color: 'red',
    },
    platelet: {
        color: 'amber',
    },
    plasma: {
        color: 'blue',
    },
};

export const DonationCard = (donation: Donation) => {
    const config = donationTypeConfig[donation.type];

    return (
        <Card
            key={donation.id}
            className={`group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-slate-200 rounded-2xl overflow-hidden h-fit`}
        >
            <CardHeader className="p-6">
                <div className="flex items-start gap-4 mb-4">
                    <div
                        className={`p-3 rounded-xl bg-${config.color}-500 shadow-lg ring-${config.color}-500/20 ring-4`}
                    >
                        <Droplets className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-bold text-slate-900 leading-tight mb-2">
                            {displayDonationType(donation.type)}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Id: {donation.id}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <Badge
                        className={`bg-${config.color}-100 text-${config.color}-800 border-${config.color}-200 border text-xs font-semibold px-2 py-1`}
                    >
                        {displayDonationType(donation.type)}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6">
                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <Droplets className="h-4 w-4 text-rose-600" />
                        <div>
                            <div className="font-semibold text-slate-900 text-sm">
                                {donation.amount}ml
                            </div>
                            <div className="text-xs text-slate-500">Amount</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <div>
                            <div className="font-semibold text-slate-900 text-sm">
                                {formatDistanceToNow(
                                    new Date(donation.created_at),
                                    { addSuffix: true },
                                )}
                            </div>
                            <div className="text-xs text-slate-500">
                                Donated
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <div>
                            <div className="font-semibold text-slate-900 text-sm">
                                {formatDateTime(new Date(donation.created_at))}
                            </div>
                            <div className="text-xs text-slate-500">Time</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-rose-600" />
                        <span className="text-sm font-semibold text-rose-800">
                            Impact
                        </span>
                    </div>
                    <p className="text-xs text-rose-700 leading-relaxed">
                        Your {donation.amount}ml{' '}
                        {displayDonationType(donation.type).toLowerCase()}{' '}
                        donation can help save lives and support medical
                        treatments.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
