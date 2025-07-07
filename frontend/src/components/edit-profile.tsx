import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Edit3, LoaderCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { genders } from "@/lib/api/dto/account";
import { capitalCase } from "change-case";
import { Textarea } from "./ui/textarea";
import { schema as updateAccountSchema } from "@/hooks/use-update-account-form";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { UseMutationResult } from "@tanstack/react-query";

export type AccountUpdate = z.infer<typeof updateAccountSchema>;
interface EditProfileProps {
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
    form: UseFormReturn<AccountUpdate>;
    mutation: UseMutationResult<void, Error, AccountUpdate>;
}


export function EditProfileModel({
    isOpen,
    onOpenChange,
    form,
    mutation
}: EditProfileProps) {
    const handleFormSubmit = (values: AccountUpdate) => {
        mutation.mutate(values);
    };
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto flex-1 pr-2">
                    <FormEdit
                        form={form}
                        mutation={mutation}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

interface formEditProps {
    form: UseFormReturn<AccountUpdate>,
    mutation: UseMutationResult<void, Error, AccountUpdate>;
}

function FormEdit({ form, mutation }: formEditProps) {
    const handleFormSubmit = (values: AccountUpdate) => {
        mutation.mutate(values);
    };
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
                                    <Input
                                        {...field}
                                        required
                                    />
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
                                    onValueChange={
                                        field.onChange
                                    }
                                    {...field}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {genders.map(
                                            (gender, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={
                                                        gender
                                                    }
                                                >
                                                    {capitalCase(
                                                        gender,
                                                    )}
                                                </SelectItem>
                                            ),
                                        )}
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
                                    <Input
                                        type="date"
                                        {...field}
                                        required
                                    />
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
                                    <Input
                                        type="tel"
                                        {...field}
                                        required
                                    />
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
                                        className='resize-none overflow-auto h-20'
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
    )
}