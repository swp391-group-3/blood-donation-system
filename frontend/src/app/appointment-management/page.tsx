'use client';

import {
    Calendar,
    Stethoscope,
    Droplets,
    CheckCircle,
    AlertTriangle,
    Clock,
    XCircle,
    Eye,
    Filter,
    Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppointmentList } from '@/hooks/use-appointment-list';
import { toast } from 'sonner';
import { Appointment } from '@/lib/api/dto/appointment';
import { Donation } from '@/lib/api/dto/donation';
import { Health } from '@/lib/api/dto/health';
import { useAccount } from '@/hooks/use-account';
import { useBloodRequest } from '@/hooks/use-blood-request';
import { useHealth } from '@/hooks/use-health';
import { useDonation } from '@/hooks/use-donation';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { useApppointmentAnswer } from '@/hooks/use-apppointment-answer';
import { useApproveAppointment } from '@/hooks/use-approve-appointment';
import { useRejectAppointment } from '@/hooks/use-reject-appointment';

const AppointmentEntry = ({ appointment }: { appointment: Appointment }) => {
    const router = useRouter();
    const member = useAccount(appointment.member_id);
    const request = useBloodRequest(appointment.request_id);
    const health = useHealth(appointment.id);
    const donation = useDonation(appointment.id);
    const answers = useApppointmentAnswer(appointment.id);
    const [isOpen, setIsOpen] = useState(false);
    const approve = useApproveAppointment(appointment.id);
    const reject = useRejectAppointment(appointment.id);

    if (
        member.isPending ||
        request.isPending ||
        health.isPending ||
        donation.isPending ||
        answers.isPending ||
        member.error ||
        request.error ||
        health.error ||
        donation.error ||
        answers.error
    ) {
        return <div></div>;
    }

    const handleApprove = () => {
        approve.mutate();
    };

    const handleReject = () => {
        reject.mutate();
    };

    const getAppointmentStatusColor = (
        appointment: Appointment,
        health?: Health,
        donation?: Donation,
    ) => {
        if (appointment.status === 'on_process')
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        if (appointment.status === 'rejected')
            return 'bg-red-100 text-red-800 border-red-200';
        if (appointment.status === 'approved')
            return 'bg-green-100 text-green-800 border-green-200';
        if (health) return 'bg-blue-100 text-blue-800 border-blue-200';
        if (donation)
            return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        return 'bg-amber-100 text-amber-800 border-amber-200';
    };

    const getAppointmentStatusText = (
        appointment: Appointment,
        health?: Health,
        donation?: Donation,
    ) => {
        if (appointment.status === 'on_process') return 'Pending Review';
        if (appointment.status === 'rejected') return 'Rejected';
        if (appointment.status === 'approved') return 'Approved';
        if (health) return 'Health Check Done';
        if (donation) return 'Completed';
    };

    const getAppointmentStatusIcon = (
        appointment: Appointment,
        health?: Health,
        donation?: Donation,
    ) => {
        if (appointment.status === 'on_process')
            return <Clock className="h-3 w-3" />;
        if (appointment.status === 'rejected')
            return <XCircle className="h-3 w-3" />;
        if (appointment.status === 'approved')
            return <CheckCircle className="h-3 w-3" />;
        if (health) return <Stethoscope className="h-3 w-3" />;
        if (donation) return <CheckCircle className="h-3 w-3" />;
        return <AlertTriangle className="h-3 w-3" />;
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getAnswerIcon = (answer: string) => {
        switch (answer) {
            case 'yes':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'no':
                return <XCircle className="h-4 w-4 text-red-600" />;
            case 'unsure':
                return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
            default:
                return null;
        }
    };

    return (
        <tr
            key={appointment.id}
            className="hover:bg-slate-50 transition-colors duration-200"
        >
            <td className="p-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-slate-700 text-sm font-bold shadow-sm border border-white">
                            {member.data.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </div>
                        <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                                appointment.status === 'on_process'
                                    ? 'bg-yellow-500'
                                    : appointment.status === 'rejected'
                                      ? 'bg-red-500'
                                      : donation.data
                                        ? 'bg-green-500'
                                        : health.data
                                          ? 'bg-blue-500'
                                          : 'bg-amber-500'
                            }`}
                        >
                            {getAppointmentStatusIcon(
                                appointment,
                                health.data,
                                donation.data,
                            )}
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-900 truncate">
                            {member.data.name}
                        </div>
                        <div className="text-sm text-slate-600 truncate">
                            {member.data.email}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            {appointment.status === 'on_process' ? (
                                <>
                                    Submitted{' '}
                                    {new Date().toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </>
                            ) : request.data.start_time ? (
                                <>
                                    Scheduled{' '}
                                    {new Date(
                                        request.data.start_time,
                                    ).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </>
                            ) : appointment.status === 'rejected' ? (
                                <>Rejected</>
                            ) : (
                                'No schedule'
                            )}
                        </div>
                    </div>
                </div>
            </td>

            {/* Blood Type */}
            <td className="p-6">
                <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-red-600">
                        {bloodGroupLabels[member.data.blood_group]}
                    </span>
                </div>
            </td>

            {/* Status */}
            <td className="p-6">
                <Badge
                    className={`px-3 py-1 font-semibold ${getAppointmentStatusColor(appointment, health.data, donation.data)}`}
                >
                    {getAppointmentStatusIcon(
                        appointment,
                        health.data,
                        donation.data,
                    )}
                    <span className="ml-2">
                        {getAppointmentStatusText(
                            appointment,
                            health.data,
                            donation.data,
                        )}
                    </span>
                </Badge>
            </td>

            {/* Risk Level */}
            <td className="p-6">
                {request.data.priority && (
                    <Badge
                        className={`capitalize px-3 py-1 font-semibold ${getRiskColor(request.data.priority)}`}
                    >
                        {request.data.priority}
                    </Badge>
                )}
            </td>

            {/* Actions */}
            <td className="p-6">
                <div className="flex gap-2">
                    {appointment.status === 'on_process' && (
                        <Dialog open={isOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    onClick={() => setIsOpen(true)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                                >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Review
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-slate-900">
                                        Application Review - {member.data.name}
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="space-y-6 mt-6">
                                    {/* Applicant Info */}
                                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                            Applicant Information
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm font-medium text-slate-500">
                                                    Name:
                                                </span>
                                                <div className="font-semibold text-slate-900">
                                                    {member.data.name}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-slate-500">
                                                    Blood Group:
                                                </span>
                                                <div className="font-semibold text-red-600">
                                                    {
                                                        bloodGroupLabels[
                                                            member.data
                                                                .blood_group
                                                        ]
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-slate-500">
                                                    Email:
                                                </span>
                                                <div className="font-semibold text-slate-900">
                                                    {member.data.email}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-slate-500">
                                                    Phone:
                                                </span>
                                                <div className="font-semibold text-slate-900">
                                                    {member.data.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                            Screening Questionnaire
                                        </h3>
                                        <div className="space-y-4">
                                            {answers.data.map(
                                                (answer, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg"
                                                        >
                                                            <div className="flex-shrink-0 mt-1">
                                                                {getAnswerIcon(
                                                                    answer.answer,
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-slate-900 mb-1">
                                                                    Q{index}:{' '}
                                                                    {
                                                                        answer.question
                                                                    }
                                                                </p>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge
                                                                        className={`capitalize text-xs ${
                                                                            answer.answer ===
                                                                            'yes'
                                                                                ? 'bg-green-100 text-green-800'
                                                                                : answer.answer ===
                                                                                    'no'
                                                                                  ? 'bg-red-100 text-red-800'
                                                                                  : 'bg-yellow-100 text-yellow-800'
                                                                        }`}
                                                                    >
                                                                        {
                                                                            answer.answer
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 pt-6 border-t border-slate-200">
                                        <Button
                                            onClick={() => {
                                                handleApprove();
                                                setIsOpen(false);
                                            }}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl"
                                        >
                                            <CheckCircle className="h-5 w-5 mr-2" />
                                            Approve & Schedule
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                handleReject();
                                                setIsOpen(false);
                                            }}
                                            variant="outline"
                                            className="flex-1 border-red-200 text-red-700 hover:bg-red-50 h-12 rounded-xl"
                                        >
                                            <XCircle className="h-5 w-5 mr-2" />
                                            Reject Application
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}

                    {appointment.status === 'approved' && !health.data && (
                        <Button
                            onClick={() =>
                                router.push(
                                    `/appointment-management/${appointment.id}/health`,
                                )
                            }
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            <Stethoscope className="h-3 w-3 mr-1" />
                            Health Check
                        </Button>
                    )}

                    {appointment.status === 'approved' &&
                        health.data &&
                        !donation.data && (
                            <Button
                                onClick={() =>
                                    router.push(
                                        `/appointment-management/${appointment.id}/donation`,
                                    )
                                }
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                                <Droplets className="h-3 w-3 mr-1" />
                                Donation
                            </Button>
                        )}

                    {appointment.status === 'approved' && donation.data && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-green-200 text-green-700 hover:bg-green-50 rounded-lg"
                        >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                        </Button>
                    )}

                    {appointment.status === 'rejected' && (
                        <Button
                            disabled
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-700 hover:bg-red-50 rounded-lg"
                        >
                            <XCircle className="h-3 w-3 mr-1" />
                            Rejected
                        </Button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default function AppointmentsPage() {
    const { data: appointments, isPending, error } = useAppointmentList();
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    if (isPending) {
        return <div></div>;
    }

    if (error) {
        toast.error(error.message);

        return <div></div>;
    }
    const filteredAppointments = appointments.filter((apt) => {
        const matchesStatus =
            filterStatus === 'all' || apt.status === filterStatus;
        // const matchesSearch =
        //     apt.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        //     apt.member_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        //     apt.request_title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus;
    });

    const pendingReviewCount = appointments.filter(
        (apt) => apt.status === 'on_process',
    ).length;
    const approvedCount = appointments.filter(
        (apt) => apt.status === 'approved',
    ).length;
    const rejectedCount = appointments.filter(
        (apt) => apt.status === 'rejected',
    ).length;
    const completedCount = appointments.filter(
        (apt) => apt.status === 'done',
    ).length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
                <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-10">
                        <svg
                            className="absolute top-4 left-4 w-32 h-32"
                            viewBox="0 0 100 100"
                            fill="none"
                        >
                            <path
                                d="M50 10 L60 40 L90 40 L68 58 L78 88 L50 70 L22 88 L32 58 L10 40 L40 40 Z"
                                fill="white"
                            />
                        </svg>
                        <svg
                            className="absolute top-12 right-8 w-24 h-24"
                            viewBox="0 0 100 100"
                            fill="none"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                stroke="white"
                                strokeWidth="2"
                                fill="none"
                            />
                            <path
                                d="M30 50 L45 50 L45 30 L55 30 L55 50 L70 50 L70 60 L55 60 L55 80 L45 80 L45 60 L30 60 Z"
                                fill="white"
                            />
                        </svg>
                        <svg
                            className="absolute bottom-8 left-1/3 w-16 h-16"
                            viewBox="0 0 100 100"
                            fill="none"
                        >
                            <path
                                d="M50 5 L55 35 L85 35 L63 53 L68 83 L50 65 L32 83 L37 53 L15 35 L45 35 Z"
                                fill="white"
                            />
                        </svg>
                        <svg
                            className="absolute bottom-4 right-1/4 w-20 h-20"
                            viewBox="0 0 100 100"
                            fill="none"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="35"
                                stroke="white"
                                strokeWidth="2"
                                fill="none"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="20"
                                stroke="white"
                                strokeWidth="2"
                                fill="none"
                            />
                            <circle cx="50" cy="50" r="8" fill="white" />
                        </svg>
                        <svg
                            className="absolute top-1/2 left-8 w-12 h-12"
                            viewBox="0 0 100 100"
                            fill="none"
                        >
                            <path
                                d="M20 50 L35 50 L35 20 L65 20 L65 50 L80 50 L80 80 L20 80 Z"
                                fill="white"
                            />
                        </svg>
                        <svg
                            className="absolute top-20 right-1/3 w-14 h-14"
                            viewBox="0 0 100 100"
                            fill="none"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="30"
                                stroke="white"
                                strokeWidth="3"
                                fill="none"
                            />
                            <path
                                d="M35 50 L50 35 L65 50 L50 65 Z"
                                fill="white"
                            />
                        </svg>
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                                    <Calendar className="h-10 w-10 text-white" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center border-2 border-white">
                                    <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">
                                    Connecting Hearts,{' '}
                                    <span className="text-blue-200">
                                        Saving Lives
                                    </span>
                                </h1>
                                <p className="text-blue-100 text-lg font-medium">
                                    Staff Dashboard - Review donor applications
                                    and coordinate life-saving blood donations
                                </p>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center gap-2 text-blue-200">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium">
                                            {pendingReviewCount} Pending Review
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-200">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            {new Date().toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-4">
                            <div className="text-right text-white">
                                <div className="text-2xl font-bold">
                                    {pendingReviewCount}
                                </div>
                                <div className="text-blue-200 text-sm">
                                    Pending Review
                                </div>
                            </div>
                            <div className="w-px h-12 bg-white/30"></div>
                            <div className="text-right text-white">
                                <div className="text-2xl font-bold">
                                    {completedCount}
                                </div>
                                <div className="text-blue-200 text-sm">
                                    Completed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                            {pendingReviewCount}
                        </div>
                    </div>
                    <div className="text-slate-600 font-medium">
                        Pending Review
                    </div>
                    <div className="text-xs text-yellow-600 font-semibold mt-1">
                        Requires staff attention
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                            {approvedCount}
                        </div>
                    </div>
                    <div className="text-slate-600 font-medium">Approved</div>
                    <div className="text-xs text-green-600 font-semibold mt-1">
                        Ready for health check
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Droplets className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                            {completedCount}
                        </div>
                    </div>
                    <div className="text-slate-600 font-medium">
                        Donations Complete
                    </div>
                    <div className="text-xs text-blue-600 font-semibold mt-1">
                        {appointments.length > 0
                            ? Math.round(
                                  (completedCount / appointments.length) * 100,
                              )
                            : 0}
                        % success rate
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                            {rejectedCount}
                        </div>
                    </div>
                    <div className="text-slate-600 font-medium">Rejected</div>
                    <div className="text-xs text-red-600 font-semibold mt-1">
                        Did not meet criteria
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                        placeholder="Search by name, email, or request..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 border-slate-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl"
                    />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48 h-11 border-slate-200 rounded-xl">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending_review">
                            Pending Review
                        </SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left p-6 font-semibold text-slate-900">
                                    Member
                                </th>
                                <th className="text-left p-6 font-semibold text-slate-900">
                                    Blood Type
                                </th>
                                <th className="text-left p-6 font-semibold text-slate-900">
                                    Status
                                </th>
                                <th className="text-left p-6 font-semibold text-slate-900">
                                    Risk Level
                                </th>
                                <th className="text-left p-6 font-semibold text-slate-900">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredAppointments.map((appointment) => (
                                <AppointmentEntry key={appointment.id} appointment={appointment} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredAppointments.length === 0 && (
                    <div className="text-center py-12">
                        <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            No appointments found
                        </h3>
                        <p className="text-slate-600">
                            No appointments match your current filters.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
