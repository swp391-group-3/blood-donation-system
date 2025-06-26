import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Beaker,
    CheckCircle,
    Clock,
    Droplets,
    Heart,
    Info,
    Save,
    Sparkles,
    Target,
    Zap,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { useDonationForm } from '@/hooks/use-donation-form';
import { donationTypes } from '@/lib/api/dto/donation';
import { capitalCase } from 'change-case';

interface Props {
    appointmentId: string;
}

const donationTypeConfigs = {
    whole_blood: {
        amount: 450,
        description: 'Standard blood donation',
        duration: '10-15 min',
        icon: Heart,
        color: 'from-red-500 to-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
    },
    power_red: {
        amount: 500,
        description: 'Double red cell donation',
        duration: '25-35 min',
        icon: Zap,
        color: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
    },
    platelet: {
        amount: 300,
        description: 'Platelet donation',
        duration: '70-90 min',
        icon: Sparkles,
        color: 'from-yellow-500 to-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
    },
    plasma: {
        amount: 600,
        description: 'Plasma donation',
        duration: '45-60 min',
        icon: Beaker,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
    },
};

export const DonationForm = ({ appointmentId }: Props) => {
    const { mutation, form } = useDonationForm(appointmentId);

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
                        <CardTitle className="flex items-center space-x-3">
                            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/25">
                                <Target className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-slate-900">
                                    Create New Donation
                                </span>
                                <div className="text-sm text-slate-600 mt-1">
                                    Select donation type and collection volume
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel>
                                            <div>
                                                <p className="text-lg font-semibold text-slate-900 mb-4">
                                                    Select Donation Type
                                                </p>
                                                <p className="text-slate-600 mb-6">
                                                    Choose the appropriate
                                                    donation method based on
                                                    patient needs
                                                </p>
                                            </div>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                {donationTypes.map((type) => {
                                                    const config =
                                                        donationTypeConfigs[
                                                            type
                                                        ];
                                                    const isSelected =
                                                        field.value === type;

                                                    return (
                                                        <Button
                                                            key={type}
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() =>
                                                                form.setValue(
                                                                    'type',
                                                                    type,
                                                                )
                                                            }
                                                            className={`h-auto p-6 text-left transition-all duration-300 rounded-2xl transform hover:scale-105 ${
                                                                isSelected
                                                                    ? `border-2 ${config.borderColor} ${config.bgColor} shadow-xl`
                                                                    : 'border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg'
                                                            }`}
                                                        >
                                                            <div className="flex items-start space-x-4 w-full">
                                                                <div
                                                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${config.color} shadow-lg`}
                                                                >
                                                                    <config.icon className="h-7 w-7 text-white" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between mb-3">
                                                                        <h3 className="text-xl font-bold text-slate-900">
                                                                            {capitalCase(
                                                                                type,
                                                                            )}
                                                                        </h3>
                                                                        {isSelected && (
                                                                            <CheckCircle className="h-6 w-6 text-red-500" />
                                                                        )}
                                                                    </div>
                                                                    <p className="text-slate-600 mb-4 leading-relaxed">
                                                                        {
                                                                            config.description
                                                                        }
                                                                    </p>
                                                                    <div className="flex items-center space-x-6 text-sm text-slate-500">
                                                                        <div className="flex items-center space-x-2">
                                                                            <Droplets className="h-4 w-4" />
                                                                            <span className="font-medium">
                                                                                {
                                                                                    config.amount
                                                                                }
                                                                                ml
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <Clock className="h-4 w-4" />
                                                                            <span className="font-medium">
                                                                                {
                                                                                    config.duration
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className="text-center mt-16 mb-8">
                                        <FormLabel>
                                            <p className="mx-auto text-lg font-semibold text-slate-900 mb-2 block">
                                                Collection Amount
                                            </p>
                                        </FormLabel>
                                        <FormDescription className="text-slate-600 mb-4">
                                            Adjust the collection volume if
                                            needed
                                        </FormDescription>
                                        <FormControl>
                                            <div className="flex justify-center">
                                                <div className="text-center">
                                                    <div className="relative inline-block">
                                                        <Input
                                                            {...field}
                                                            className="text-center !text-xl font-bold h-16 w-40 border-2 focus:border-red-500 rounded-2xl transition-all pr-12"
                                                            placeholder="300"
                                                            min="100"
                                                            max="1000"
                                                        />
                                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium pointer-events-none">
                                                            ml
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) =>
                                    field.value && (
                                        <Alert className="border-blue-200 bg-blue-50 rounded-xl flex items-center">
                                            <AlertDescription className="text-blue-800 flex items-center">
                                                <Info className="text-blue-600 size-6 mr-1" />
                                                <strong>
                                                    {capitalCase(field.value)}
                                                </strong>{' '}
                                                donation selected. Expected
                                                duration:{' '}
                                                <strong>
                                                    {
                                                        donationTypeConfigs[
                                                            field.value
                                                        ].duration
                                                    }
                                                </strong>
                                                .{' '}
                                                {
                                                    donationTypeConfigs[
                                                        field.value
                                                    ].description
                                                }
                                            </AlertDescription>
                                        </Alert>
                                    )
                                }
                            />
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="bg-red-600 hover:bg-red-700 py-6 transition-all"
                    >
                        {mutation.isPending ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                Creating Donation...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5 mr-3" />
                                Create Donation
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
