import { BloodRequest } from '@/lib/api/dto/blood-request';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Calendar, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { capitalCase } from 'change-case';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { Progress } from '@radix-ui/react-progress';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const priorityConfigs = {
    high: {
        color: 'rose',
        icon: AlertTriangle,
    },
    medium: {
        color: 'amber',
        icon: Clock,
    },
    low: {
        color: 'blue',
        icon: Calendar,
    },
};

export const RequestCard = (request: BloodRequest) => {
    const config = priorityConfigs[request.priority];
    const progress = Math.round(
        (request.current_people / request.max_people) * 100,
    );
    const timeRemaining = formatDistanceToNow(request.end_time);

    return (
        <Card
            key={request.id}
            className={`ring-${config.color}-500/20 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-slate-200 rounded-2xl overflow-hidden h-fit`}
        >
            <CardHeader className="p-6">
                <div className="flex items-start gap-4 mb-4">
                    <div
                        className={`p-3 rounded-xl bg-${config.color}-500 shadow-lg ring-${config.color}-500/20 ring-4`}
                    >
                        <config.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="flex items-center gap-5 text-lg font-bold text-slate-900 leading-tight mb-3">
                            {request.title}
                            <Badge
                                className={`bg-${config.color}-100 text-${config.color}-800 border-${config.color}-200 border text-xs font-semibold px-2 py-1`}
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

                <Button className="w-full h-10 font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25 transition-all duration-200">
                    Apply Now
                </Button>
            </CardContent>
        </Card>
    );
};
