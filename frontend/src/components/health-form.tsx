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
                    <CardHeader>
                        <CardTitle className="flex text-xl items-center space-x-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            <span>Health Assessment Form</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="my-5">
                        <div className="space-y-8">
                            <FormField
                                control={form.control}
                                name="temperature"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="flex items-center space-x-2">
                                            <Thermometer className="h-4 w-4 text-red-500" />
                                            <span>Temperature (°C)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                step="0.1"
                                                placeholder="36.5"
                                                required
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="flex items-center space-x-2">
                                            <Weight className="h-4 w-4 text-blue-500" />
                                            <span>Weight (kg)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                step="1"
                                                placeholder="70"
                                                required
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="heart_rate"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="flex items-center space-x-2">
                                            <Activity className="h-4 w-4 text-pink-500" />
                                            <span>Heart Rate (bpm)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                step="1"
                                                placeholder="72"
                                                required
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-2">
                                <Label className="flex items-center space-x-2">
                                    <Activity className="h-4 w-4 text-purple-500" />
                                    <span>Blood Pressure (mmHg)</span>
                                </Label>
                                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                                    <FormField
                                        control={form.control}
                                        name="upper_blood_pressure"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        step="1"
                                                        placeholder="120"
                                                        required
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <span className="text-lg font-bold text-gray-400">
                                        /
                                    </span>
                                    <FormField
                                        control={form.control}
                                        name="lower_blood_pressure"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        step="1"
                                                        placeholder="80"
                                                        required
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="flex items-center space-x-2 mb-3">
                                            <FileText className="h-4 w-4 text-blue-500" />
                                            <span>Medical Notes</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className="min-h-[100px] resize-none"
                                                placeholder="Enter any medical observations, concerns, or notes about the donor's condition..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="is_good_health"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center space-x-2 mb-4">
                                            <Shield className="h-4 w-4 text-amber-500" />
                                            <span>
                                                Donation Eligibility Decision
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <Button
                                                    type="button"
                                                    variant={
                                                        field.value
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    onClick={() => {
                                                        form.setValue(
                                                            'is_good_health',
                                                            true,
                                                        );
                                                    }}
                                                    className={`h-20 transition-all ${
                                                        field.value
                                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                                            : 'border-green-200 text-green-700 hover:bg-green-50'
                                                    }`}
                                                >
                                                    <div className="text-center">
                                                        <CheckCircle className="h-6 w-6 mx-auto mb-1" />
                                                        <div className="font-semibold">
                                                            APPROVED
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
                                                    className={`h-20 transition-all ${
                                                        !field.value
                                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                                            : 'border-red-200 text-red-700 hover:bg-red-50'
                                                    }`}
                                                >
                                                    <div className="text-center">
                                                        <AlertCircle className="h-6 w-6 mx-auto mb-1" />
                                                        <div className="font-semibold">
                                                            DEFERRED
                                                        </div>
                                                        <div className="text-sm opacity-90">
                                                            Not eligible today
                                                        </div>
                                                    </div>
                                                </Button>
                                            </div>
                                        </FormControl>
                                        {field.value && (
                                            <Alert className="border-green-200 bg-green-50">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <AlertDescription className="text-green-800">
                                                    Donor approved for donation
                                                    and will proceed to the
                                                    donation process.
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        {!field.value && (
                                            <Alert className="border-amber-200 bg-amber-50">
                                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                                <AlertDescription className="text-amber-800">
                                                    Donor deferred from
                                                    donation. Please ensure all
                                                    reasons are documented in
                                                    medical notes.
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" className="px-6">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving Assessment...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Complete Assessment
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
