import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Edit3, LoaderCircle } from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { capitalCase } from 'change-case';
import { Textarea } from './ui/textarea';
import { z } from 'zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { genders, updateAccountSchema, updateCurrentAccount } from '@/lib/service/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

export const UpdateAccountDialog = () => {

    const mutation = useMutation({
        mutationFn: updateCurrentAccount,
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            toast.info('Create Donation Successfully');
            queryClient.invalidateQueries({
                queryKey: ['appointment', appointmentId],
            });
        },
 } );

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {},
    });

    return (
        <Form {...form}>
            <form
                className="space-y-6"
                onSubmit={form.handleSubmit(handleFormSubmit)}
            >
                <div className="grid auto-cols-fr gap-5">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Gender</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    {...field}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {genders.map((gender, index) => (
                                            <SelectItem
                                                key={index}
                                                value={gender}
                                            >
                                                {capitalCase(gender)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="birthday"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Birthday</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input type="tel" {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        required
                                        className="resize-none overflow-auto h-20"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center ">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            data-loading={mutation.isPending}
                            className="group relative disabled:opacity-100"
                        >
                            <span className="group-data-[loading=true]:text-transparent">
                                Update
                            </span>
                            {mutation.isPending && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <LoaderCircle
                                        className="animate-spin"
                                        size={16}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};
