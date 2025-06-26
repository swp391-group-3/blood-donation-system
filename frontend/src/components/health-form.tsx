import { useHealthForm } from '@/hooks/use-health-form';
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
    Heart,
    Save,
    Shield,
    Thermometer,
    Weight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from './ui/alert';

interface Props {
    appointmentId: string;
}

export const HealthForm = ({ appointmentId }: Props) => {
    const { mutation, form } = useHealthForm(appointmentId);

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
                            <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/25">
                                <Activity className="size-8 text-white" />
                            </div>
                            <span className="text-2xl">
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
                                                        placeholder="70"
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
            </form>
        </Form>
    );
};
