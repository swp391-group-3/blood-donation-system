import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    FileText,
    Save,
    Shield,
    Thermometer,
    Weight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import z from 'zod';
import { createHealth, createHealthSchema } from '@/lib/service/health';
import { ApiError } from '@/lib/service';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface Props {
    appointmentId: string;
}

export const HealthForm = ({ appointmentId }: Props) => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: (values: z.infer<typeof createHealthSchema>) =>
            createHealth(appointmentId, values),
        onError: (error: ApiError) => toast.error(error.message),
        onSuccess: () => {
            toast.info('Create health successfully');
            router.push('/appointment/management');
        },
    });

    const form = useForm<z.infer<typeof createHealthSchema>>({
        resolver: zodResolver(createHealthSchema),
        defaultValues: {},
    });

    return (
        <Form {...form}>
            <form
                className="space-y-6"
                onSubmit={form.handleSubmit((values) =>
                    mutation.mutate(values),
                )}
            >
                <Card>
                    <CardHeader className="px-8">
                        <CardTitle className="flex items-center space-x-3">
                            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/25">
                                <Activity className="size-6 text-white" />
                            </div>
                            <span className="text-lg">
                                Vital Signs Assessment
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="temperature"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <FormLabel className="space-y-4">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="p-3 bg-red-100 rounded-xl">
                                                <Thermometer className="h-6 w-6 text-red-600" />
                                            </div>
                                            <div>
                                                <Label className="text-lg font-semibold text-slate-900">
                                                    Body Temperature
                                                </Label>
                                                <div className="text-sm text-slate-600">
                                                    Normal range: 36.1-37.2°C
                                                </div>
                                            </div>
                                        </div>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                className="text-center !text-lg font-bold h-12 focus:border-red-500 transition-all"
                                                placeholder="36.5"
                                                {...field}
                                            />
                                            <div className="text-lg absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                                                °C
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <FormLabel className="space-y-4">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="p-3 bg-blue-100 rounded-xl">
                                                <Weight className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <Label className="text-lg font-semibold text-slate-900">
                                                    Weight
                                                </Label>
                                                <div className="text-sm text-slate-600">
                                                    Minimum required: 50kg
                                                </div>
                                            </div>
                                        </div>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                className="text-center !text-lg font-bold h-12 focus:border-red-500 transition-all"
                                                placeholder="70"
                                                {...field}
                                            />
                                            <div className="text-lg absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                                                kg
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="heart_rate"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <FormLabel className="space-y-4">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="p-3 bg-pink-100 rounded-xl">
                                                <Activity className="h-6 w-6 text-pink-600" />
                                            </div>
                                            <div>
                                                <Label className="text-lg font-semibold text-slate-900">
                                                    Heart Rate
                                                </Label>
                                                <div className="text-sm text-slate-600">
                                                    Normal range: 60-100 bpm
                                                </div>
                                            </div>
                                        </div>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                className="text-center !text-lg font-bold h-12 focus:border-red-500 transition-all"
                                                placeholder="72"
                                                {...field}
                                            />
                                            <div className="text-lg absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                                                bpm
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid gap-2 space-y-4">
                            <Label className="space-y-4">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-3 bg-purple-100 rounded-xl">
                                        <Activity className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <Label className="text-lg font-semibold text-slate-900">
                                            Blood Pressure
                                        </Label>
                                        <div className="text-sm text-slate-600">
                                            {'Normal: <140/90 mmHg'}
                                        </div>
                                    </div>
                                </div>
                            </Label>
                            <div className="w-full grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                                <FormField
                                    control={form.control}
                                    name="upper_blood_pressure"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        className="text-center !text-lg font-bold h-12 focus:border-red-500 transition-all"
                                                        placeholder="120"
                                                        {...field}
                                                    />
                                                    <div className="text-lg absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                                                        sys
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="text-xl font-bold text-slate-400">
                                    /
                                </div>
                                <FormField
                                    control={form.control}
                                    name="lower_blood_pressure"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        className="text-center !text-lg font-bold h-12 focus:border-red-500 transition-all"
                                                        placeholder="70"
                                                        {...field}
                                                    />
                                                    <div className="text-lg absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                                                        dia
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="px-8">
                        <CardTitle className="flex items-center space-x-3">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/25">
                                <FileText className="size-6 text-white" />
                            </div>
                            <span className="text-lg">Medical Notes</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 py-4">
                        <FormItem>
                            <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className="min-h-[120px] resize-none border-2 focus:border-blue-500 rounded-xl text-base transition-all"
                                                placeholder="Enter any medical observations, concerns, or notes about the donor's condition..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </FormItem>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="px-8">
                        <CardTitle className="flex items-center space-x-3">
                            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/25">
                                <Shield className="size-6 text-white" />
                            </div>
                            <span className="text-lg">
                                Donation Eligibility Decision
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <FormField
                            control={form.control}
                            name="is_good_health"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <FormControl>
                                        <div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Button
                                                    type="button"
                                                    variant={
                                                        field.value
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    onClick={() =>
                                                        form.setValue(
                                                            'is_good_health',
                                                            true,
                                                        )
                                                    }
                                                    className={`h-24 transition-all duration-300 rounded-2xl ${
                                                        field.value
                                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-xl shadow-green-500/25 transform'
                                                            : 'border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300'
                                                    }`}
                                                >
                                                    <div className="text-center">
                                                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                                                        <div className="text-lg font-bold">
                                                            Approve
                                                        </div>
                                                        <div className="text-sm opacity-90">
                                                            Eligible for
                                                            donation
                                                        </div>
                                                    </div>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant={
                                                        !field.value
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    onClick={() =>
                                                        form.setValue(
                                                            'is_good_health',
                                                            false,
                                                        )
                                                    }
                                                    className={`h-24 transition-all duration-300 rounded-2xl ${
                                                        !field.value
                                                            ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-xl shadow-red-500/25 transform'
                                                            : 'border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300'
                                                    }`}
                                                >
                                                    <div className="text-center">
                                                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                                                        <div className="text-lg font-bold">
                                                            Reject
                                                        </div>
                                                        <div className="text-sm opacity-90">
                                                            Not eligible today
                                                        </div>
                                                    </div>
                                                </Button>
                                            </div>

                                            {field.value && (
                                                <Alert className="border-green-200 bg-green-50 mt-6 rounded-xl">
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                    <AlertDescription className="text-green-800 font-medium">
                                                        Donor approved for
                                                        donation and will
                                                        proceed to the donation
                                                        process.
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            {!field.value && (
                                                <Alert className="border-amber-200 bg-amber-50 mt-6 rounded-xl">
                                                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                                                    <AlertDescription className="text-amber-800 font-medium">
                                                        Donor deferred from
                                                        donation. Please ensure
                                                        all reasons are
                                                        documented in medical
                                                        notes.
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                <div className="flex justify-end space-x-4 pt-8">
                    <Button
                        type="button"
                        onClick={() => {
                            router.push('/appointment/management');
                        }}
                        variant="outline"
                        className="px-8 py-6 transition-all"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 py-6 transition-all"
                    >
                        {mutation.isPending ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                Saving Assessment...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5 mr-3" />
                                Complete Assessment
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
