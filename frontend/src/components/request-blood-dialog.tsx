'use client';

import React, { PropsWithChildren, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Droplet } from 'lucide-react';
import { DateTimePicker } from '@/components/date-time-picker';
import { MultiSelect } from '@/components/multi-select';
import { useMutation } from '@tanstack/react-query';
import {
    createBloodRequest,
    createBloodRequestSchema,
    priorities,
} from '@/lib/service/blood-request';
import { bloodGroupLabels, bloodGroups } from '@/lib/service/account';
import { ApiError } from '@/lib/service';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

export const RequestBloodDialog = ({ children }: PropsWithChildren) => {
    const [open, setOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: createBloodRequest,
        onError: (error: ApiError) => toast.error(error.message),
        onSuccess: () => {
            toast.info('Create blood request successfully');
            setOpen(true);
        },
    });

    const form = useForm<z.infer<typeof createBloodRequestSchema>>({
        resolver: zodResolver(createBloodRequestSchema),
        defaultValues: {},
    });

    const bloodGroupOptions = bloodGroups.map((bg) => ({
        value: bg,
        label: bloodGroupLabels[bg],
    }));

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Droplet className="h-5 w-5 text-red-600" />
                        Request Blood
                    </DialogTitle>
                    <DialogDescription>
                        Fill out this form to request blood for medical
                        purposes. All requests are reviewed by our medical team.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((values) =>
                            mutation.mutate(values),
                        )}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter the request title"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="blood_groups"
                                render={({ field }) => {
                                    const selectedOptions =
                                        bloodGroupOptions.filter((opt) =>
                                            field.value?.includes(opt.value),
                                        );
                                    return (
                                        <FormItem>
                                            <FormLabel>
                                                Blood Group(s)
                                            </FormLabel>
                                            <MultiSelect
                                                options={bloodGroupOptions}
                                                selected={selectedOptions}
                                                onChange={(opts) =>
                                                    field.onChange(
                                                        opts.map(
                                                            (opt) => opt.value,
                                                        ),
                                                    )
                                                }
                                                placeholder="Select blood groups"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {priorities.map((priority) => (
                                                    <SelectItem
                                                        key={priority}
                                                        value={priority}
                                                    >
                                                        {priority
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            priority.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="max_people"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max People</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            placeholder="Enter the max number of people"
                                            {...field}
                                            value={field.value ?? 1}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="start_time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <DateTimePicker
                                        date={field.value}
                                        onDateChange={(newDate) => {
                                            form.setValue(
                                                'start_time',
                                                newDate,
                                            );
                                        }}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="end_time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <DateTimePicker
                                        date={field.value}
                                        onDateChange={(newDate) => {
                                            form.setValue('end_time', newDate);
                                        }}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-red-600 hover:bg-red-700"
                                disabled={mutation.isPending}
                            >
                                Submit Request
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
