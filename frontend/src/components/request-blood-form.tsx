import React from 'react';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { type DateRange } from 'react-day-picker';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    CalendarIcon,
    Droplet,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { bloodTypes, urgencyLevels } from "../../constants/sample-data"

export const requestBloodSchema = z.object({
    bloodType: z.string().min(1, 'Please select the blood type'),
    quantity: z.number().min(1, 'Please input the quantity'),
    urgency: z.string().min(1, 'Please select the urgency of the request'),
    reason: z.string().min(1, 'Input the medical reason for this request'),
    date: z.string().min(1, 'Please select the date of the donation'),
    terms: z.boolean().refine((val) => val, 'You must confirm legitimacy'),
    emergency: z.boolean().refine((val) => val, 'Acknowledge emergency policy'),
});
export type RequestBloodFormType = z.infer<typeof requestBloodSchema>;

export default function RequestBloodDialog() {
    const [requestFormOpen, setRequestFormOpen] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const form = useForm<RequestBloodFormType>({
            resolver: zodResolver(requestBloodSchema),
            defaultValues: {
                bloodType: 'A+',
                quantity: 1,
                urgency: 'normal',
                reason: '',
                date: undefined,
                terms: false,
                emergency: false,
            },
        });
    const onRequestSubmit = (data: RequestBloodFormType) => {
        // come in future
        setRequestFormOpen(false);
    };
    
    return(
        <Dialog open={requestFormOpen} onOpenChange={setRequestFormOpen}>
            <DialogTrigger asChild>
                <Button className="bg-white text-red-600 hover:bg-gray-100">
                    <Droplet className="mr-2 h-4 w-4" />
                    Request Blood
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Droplet className="h-5 w-5 text-red-600" />
                        Request Blood
                    </DialogTitle>
                    <DialogDescription>
                        Fill out this form to request blood for medical purposes. All
                        requests are reviewed by our medical team.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onRequestSubmit)} className="space-y-6">
                        <div className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="bloodType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Blood Type</FormLabel>
                                            <Select>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Blood Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {bloodTypes.map((type) => (
                                                        <SelectItem value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity (units) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    {...field}
                                                    value={field.value ?? 1}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(e.target.value),
                                                        )
                                                    }
                                                ></Input>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="urgency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Urgency Level *</FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select the urgent level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {urgencyLevels.map((item) => (
                                                    <SelectItem
                                                        key={item.value}
                                                        value={item.value}
                                                    >
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Medical Reason</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={3}
                                                placeholder="Please provide the request reason"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Require By *</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        id="dates"
                                                        className={
                                                            'w-full justify-start text-left font-normal' +
                                                            (!field.value
                                                                ? ' text-muted-foreground'
                                                                : '')
                                                        }
                                                    >
                                                        {dateRange?.from &&
                                                        dateRange?.to
                                                            ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                                                            : 'Select Date'}
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="range"
                                                    selected={dateRange}
                                                    captionLayout="dropdown"
                                                    onSelect={(dateRange) =>
                                                        setDateRange(dateRange)
                                                    }
                                                    className="rounded-lg border shadow-sm"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <FormField
                                    control={form.control}
                                    name="terms"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    id="terms"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm font-medium leading-none">
                                                I confirm this is a legitimate medical
                                                request
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="emergency"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    id="emergency"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm font-medium leading-none">
                                                I understand that false emergency
                                                requests may result in account
                                                suspension
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setRequestFormOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Submit Request
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

