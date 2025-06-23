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
    Beaker,
    CheckCircle,
    Droplets,
    FileText,
    Info,
    Save,
    Sparkles,
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
        icon: Droplets,
        color: 'bg-red-500',
    },
    power_red: {
        amount: 500,
        description: 'Double red cell donation',
        duration: '25-35 min',
        icon: Zap,
        color: 'bg-orange-500',
    },
    platelet: {
        amount: 300,
        description: 'Platelet donation',
        duration: '70-90 min',
        icon: Sparkles,
        color: 'bg-yellow-500',
    },
    plasma: {
        amount: 600,
        description: 'Plasma donation',
        duration: '45-60 min',
        icon: Beaker,
        color: 'bg-blue-500',
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
                        <CardTitle className="text-xl flex items-center space-x-2">
                            <FileText className="size-8 text-blue-600" />
                            <span>Create Donation</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-base font-medium text-gray-900">
                                            Select Donation Type
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
                                                            className={`h-auto p-6 text-left transition-all ${
                                                                isSelected
                                                                    ? 'border-red-500 bg-red-50 shadow-md'
                                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            <div className="flex items-start space-x-4 w-full">
                                                                <div
                                                                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${config.color}`}
                                                                >
                                                                    <config.icon className="h-6 w-6 text-white" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <h3 className="capitalize font-semibold text-gray-900">
                                                                            {
                                                                                type
                                                                            }
                                                                        </h3>
                                                                        {isSelected && (
                                                                            <CheckCircle className="h-5 w-5 text-red-500" />
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm text-gray-600 mb-2">
                                                                        {
                                                                            config.description
                                                                        }
                                                                    </p>
                                                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                                        <span>
                                                                            Volume:{' '}
                                                                            {
                                                                                config.amount
                                                                            }
                                                                            ml
                                                                        </span>
                                                                        <span>
                                                                            Duration:{' '}
                                                                            {
                                                                                config.duration
                                                                            }
                                                                        </span>
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
                                    <FormItem className="space-y-4 mb-8">
                                        <FormLabel className="text-base font-medium text-gray-900">
                                            Collection Amount
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex items-center space-x-4">
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    required
                                                />
                                                <span>
                                                    ml
                                                </span>
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
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertDescription>
                                                <span className="font-bold">
                                                    {capitalCase(field.value)}
                                                </span>
                                                donation selected. Expected
                                                duration:{' '}
                                                {
                                                    donationTypeConfigs[
                                                        field.value
                                                    ].duration
                                                }
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
                    <Button type="submit" disabled={mutation.isPending}>
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
