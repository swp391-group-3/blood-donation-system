import { formatDistanceToNow } from 'date-fns';
import { BookOpenCheck, Calendar, Clock, Droplets, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { formatDateTime, generateCertificate } from '@/lib/utils';
import { Button } from './ui/button';
import { Donation } from '@/lib/service/donation';
import { Account } from '@/lib/service/account';
import { capitalCase } from 'change-case';

const donationTypeConfig = {
    whole_blood: {
        color: 'bg-rose-500',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        ringColor: 'ring-rose-500/20',
    },
    power_red: {
        color: 'bg-red-600',
        badgeColor: 'bg-red-100 text-red-800 border-red-200',
        ringColor: 'ring-red-500/20',
    },
    platelet: {
        color: 'bg-amber-500',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        ringColor: 'ring-amber-500/20',
    },
    plasma: {
        color: 'bg-blue-500',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        ringColor: 'ring-blue-500/20',
    },
};

interface Props {
    account: Account;
    donation: Donation;
}

export const DonationCard = ({ donation, account }: Props) => {
    const config = donationTypeConfig[donation.type];

    return (
        <Card
            key={donation.id}
            className={`group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-slate-200 rounded-2xl overflow-hidden h-fit`}
        >
            <CardHeader className="p-6">
                <div className="flex items-start gap-4 mb-4">
                    <div
                        className={`p-3 rounded-xl ${config.color} shadow-lg ${config.ringColor} ring-4`}
                    >
                        <Droplets className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-bold text-slate-900 leading-tight mb-2">
                            {capitalCase(donation.type)}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Id: {donation.id}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <Badge
                        className={`${config.badgeColor} border text-xs font-semibold px-2 py-1`}
                    >
                        {capitalCase(donation.type)}
                    </Badge>
                </div>
                <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/80 hover:bg-white"
                    onClick={async () => {
                        if (!account) return;
                        const printWindow = window.open('', '_blank');
                        if (printWindow) {
                            printWindow.document.write(
                                await generateCertificate(donation, account),
                            );
                            printWindow.document.close();
                            printWindow.focus();
                        }
                    }}
                >
                    <BookOpenCheck className="h-4 w-4 mr-2" />
                    View Certificate
                </Button>
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
                        {capitalCase(donation.type).toLowerCase()} donation can
                        help save lives and support medical treatments.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
