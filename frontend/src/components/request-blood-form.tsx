import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useBloodRequestForm } from '@/hooks/use-create-blood-request';
import { CalendarIcon, Droplet } from 'lucide-react';
import { bloodGroups, bloodGroupLabels } from '@/lib/api/dto/blood-group';
import { priorities } from '@/lib/api/dto/blood-request';
import { MultiSelect } from '@/components/multi-select';
export default function RequestBloodDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { form, mutation } = useBloodRequestForm();
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    const bloodGroupOptions = bloodGroups.map((bg) => ({
        value: bg,
        label: bloodGroupLabels[bg],
    }));

    const onSubmit = (data: any) => {
        mutation.mutate({
            ...data,
            start_time: startDate,
            end_time: endDate,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter the request title"
                                            {...field}
                                        />
                                    </FormControl>
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
                                                Blood Group(s) *
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
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority *</FormLabel>
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
                                                {priorities.map((pri) => (
                                                    <SelectItem
                                                        key={pri}
                                                        value={pri}
                                                    >
                                                        {pri
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            pri.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="max_people"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max People *</FormLabel>
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
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="start_time"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Start Date *</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={
                                                            'w-full justify-start text-left font-normal' +
                                                            (!startDate
                                                                ? ' text-muted-foreground'
                                                                : '')
                                                        }
                                                    >
                                                        {startDate
                                                            ? startDate.toLocaleDateString()
                                                            : 'Select Start Date'}
                                                        <CalendarIcon className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={setStartDate}
                                                    className="rounded-lg border shadow-sm"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="end_time"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>End Date *</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={
                                                            'w-full justify-start text-left font-normal' +
                                                            (!endDate
                                                                ? ' text-muted-foreground'
                                                                : '')
                                                        }
                                                    >
                                                        {endDate
                                                            ? endDate.toLocaleDateString()
                                                            : 'Select End Date'}
                                                        <CalendarIcon className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={endDate}
                                                    onSelect={setEndDate}
                                                    className="rounded-lg border shadow-sm"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
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
}
