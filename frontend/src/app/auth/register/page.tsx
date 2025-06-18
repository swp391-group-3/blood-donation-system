'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/separator';
import { OAuth2 } from '@/components/oauth2';
import { useRegisterForm } from '@/hooks/auth/useRegisterForm';
import { displayGender, genders } from '@/lib/api/dto/account';
import { bloodGroups, displayBloodGroup } from '@/lib/api/dto/blood-group';

const RegisterForm = () => {
    const { mutation, form } = useRegisterForm();

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) =>
                    mutation.mutate(values),
                )}
            >
                <div className="flex flex-col gap-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
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
                        name="name"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Gender</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    'justify-between',
                                                    !field.value &&
                                                        'text-muted-foreground',
                                                )}
                                            >
                                                {field.value
                                                    ? displayGender(field.value)
                                                    : 'Select Gender'}
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>
                                                    No entry found
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {genders.map((value) => (
                                                        <CommandItem
                                                            value={displayGender(
                                                                value,
                                                            )}
                                                            key={value}
                                                            onSelect={() => {
                                                                form.setValue(
                                                                    'gender',
                                                                    value,
                                                                );
                                                            }}
                                                        >
                                                            {displayGender(
                                                                value,
                                                            )}
                                                            <Check
                                                                className={cn(
                                                                    'ml-auto',
                                                                    value ===
                                                                        field.value
                                                                        ? 'opacity-100'
                                                                        : 'opacity-0',
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
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
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="blood_group"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Blood Group</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    'justify-between',
                                                    !field.value &&
                                                        'text-muted-foreground',
                                                )}
                                            >
                                                {field.value
                                                    ? displayBloodGroup(
                                                          field.value,
                                                      )
                                                    : 'Select Blood Group'}
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>
                                                    No entry found
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {bloodGroups.map(
                                                        (value) => (
                                                            <CommandItem
                                                                value={displayBloodGroup(
                                                                    value,
                                                                )}
                                                                key={value}
                                                                onSelect={() => {
                                                                    form.setValue(
                                                                        'blood_group',
                                                                        value,
                                                                    );
                                                                }}
                                                            >
                                                                {displayBloodGroup(
                                                                    value,
                                                                )}
                                                                <Check
                                                                    className={cn(
                                                                        'ml-auto',
                                                                        value ===
                                                                            field.value
                                                                            ? 'opacity-100'
                                                                            : 'opacity-0',
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ),
                                                    )}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
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
                                    <Textarea {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {mutation.status === 'pending' ? (
                        <Button disabled className="w-full py-5">
                            <Loader2 className="animate-spin" />
                            Loading
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full py-5">
                            Register
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
};

export default function RegisterPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-lg">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl text-center">
                                Register
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RegisterForm />
                        </CardContent>
                        <div className="mx-5">
                            <Separator text="or" />
                            <OAuth2 />
                        </div>
                    </Card>

                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link
                            href="/auth/login"
                            className="underline underline-offset-4"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
