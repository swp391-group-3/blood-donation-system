import { BloodRequest } from '@/lib/api/dto/blood-request';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Calendar, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { capitalCase } from 'change-case';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { UpdateBloodRequestDialog } from '@/components/update-blood-request-dialog';
import { useCurrentAccount } from '@/hooks/use-current-account';
import { Progress } from '@/components/ui/progress';
import { useNextDonatableDate } from '@/hooks/use-next-donatable-date';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const priorityConfig = {
    high: {
        color: 'bg-rose-500',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: AlertTriangle,
        ringColor: 'ring-rose-500/20',
    },
    medium: {
        color: 'bg-amber-500',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock,
        ringColor: 'ring-amber-500/20',
    },
    low: {
        color: 'bg-blue-500',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Calendar,
        ringColor: 'ring-blue-500/20',
    },
};

const ActionButton = (request: BloodRequest) => {
    const { data: account } = useCurrentAccount();
    const { data: nextDonatableDate } = useNextDonatableDate();

    function isSameDate(nextDonatableDate: Date): boolean {
        const targetDate = new Date(nextDonatableDate);
        const now = new Date();

        return (
            targetDate.getFullYear() === now.getFullYear() &&
            targetDate.getMonth() === now.getMonth() &&
            targetDate.getDate() === now.getDate()
        );
    }

    const daysUntilNextDonation = nextDonatableDate
        ? Math.ceil(
              (nextDonatableDate.getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24),
          )
        : undefined;

    if (account?.role === 'donor') {
        if (account.is_banned) {
            return (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-full h-10 font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25 transition-all duration-200">
                            Apply Now
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                You are permanently banned
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-red-600">
                                You are no longer allowed to donate blood.
                                Please contact support for further assistance.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        }

        return (
            nextDonatableDate && (
                <Button className="w-full h-10 font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25 transition-all duration-200">
                    {isSameDate(nextDonatableDate) ? (
                        <Link
                            className="w-full h-full"
                            href={`/request/apply/${request.id}`}
                        >
                            Apply Now
                        </Link>
                    ) : (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <div className="w-full h-full">Apply Now</div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        You are unable to apply this request now
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You will be able to donate in{' '}
                                        {daysUntilNextDonation} days.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </Button>
            )
        );
    }

    if (request.is_editable) {
        return (
            <UpdateBloodRequestDialog id={request.id}>
                <Button className="w-full h-10 font-semibold rounded-xl shadow-lg transition-all duration-200">
                    Edit
                </Button>
            </UpdateBloodRequestDialog>
        );
    }

    return <></>;
};

const calculateRelativeTime = (date: Date) => {
    const raw = formatDistanceToNow(date);

    return raw.charAt(0).toUpperCase() + raw.slice(1);
};

export const RequestCard = (request: BloodRequest) => {
    const config = priorityConfig[request.priority];
    const progress = Math.round(
        (request.current_people / request.max_people) * 100,
    );
    const timeRemaining = calculateRelativeTime(request.end_time);

    return (
        <Card
            key={request.id}
            className={`${config.ringColor} group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-slate-200 rounded-2xl overflow-hidden h-fit`}
        >
            <CardHeader className="p-6">
                <div className="flex items-start gap-4 mb-4">
                    <div
                        className={`p-3 rounded-xl ${config.color} ${config.ringColor} shadow-lg ring-4`}
                    >
                        <config.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="flex items-center gap-5 text-lg font-bold text-slate-900 leading-tight mb-3">
                            {request.title}
                            <Badge
                                className={`${config.badgeColor} border text-xs font-semibold px-2 py-1`}
                            >
                                {capitalCase(request.priority)}
                            </Badge>
                        </CardTitle>
                    </div>
                </div>
                <div>
                    <div className="text-xs font-medium text-slate-500 mb-2">
                        Blood Types Needed
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {request.blood_groups.map((type, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="bg-rose-50 text-rose-700 border-rose-200 text-xs font-semibold px-2 py-1"
                            >
                                {bloodGroupLabels[type]}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <div>
                            <div className="font-semibold text-slate-900 text-sm">
                                {timeRemaining}
                            </div>
                            <div className="text-xs text-slate-500">
                                Time Left
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <Users className="h-4 w-4 text-emerald-600" />
                        <div>
                            <div className="font-semibold text-slate-900 text-sm">
                                {request.current_people}/{request.max_people}
                            </div>
                            <div className="text-xs text-slate-500">Donors</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <div>
                            <div className="font-semibold text-slate-900 text-sm">
                                {new Date(
                                    request.start_time,
                                ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-slate-500">
                                Start Date
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-amber-600" />
                        <div>
                            <div className="font-semibold text-slate-900 text-sm">
                                {new Date(
                                    request.end_time,
                                ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-slate-500">
                                End Date
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-700">
                            Progress
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                            {progress}%
                        </span>
                    </div>
                    <Progress
                        value={progress}
                        className={`h-2 bg-slate-200 rounded-full ${
                            request.priority === 'high'
                                ? '[&>div]:bg-rose-500'
                                : request.priority === 'medium'
                                  ? '[&>div]:bg-amber-500'
                                  : '[&>div]:bg-blue-500'
                        }`}
                    />
                    <div className="text-xs text-slate-500 font-medium">
                        {request.max_people - request.current_people} more
                        donors needed
                    </div>
                </div>
                <ActionButton {...request} />
            </CardContent>
        </Card>
    );
};
