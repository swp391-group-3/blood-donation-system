'use client';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Content } from '@tiptap/react';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { TooltipProvider } from '@/components/ui/tooltip';
import { availableTags } from '../../../../constants/sample-data';
import { MultiSelect, type Option} from "@/components/multi-select"

const formSchema = z.object({
    title: z.string().min(5, {
        message: 'Title must be at least 5 characters.',
    }),
    summary: z.string().min(10, {
        message: 'Summary must be at least 10 characters.',
    }),
    tags: z.array(z.string()).min(1, {
        message: 'At least one tag is required.',
    }),
    content: z.string().min(50, {
        message: 'Content must be at least 50 characters.',
    }),
});

const options: Option[] = [
    { label: "Apple", value: "apple", category: "Fruits" },
    { label: "Banana", value: "banana", category: "Fruits" },
    { label: "Cherry", value: "cherry", category: "Fruits" },
    { label: "Date", value: "date", category: "Fruits" },
    { label: "Elderberry", value: "elderberry", category: "Fruits" },
    { label: "Carrot", value: "carrot", category: "Vegetables" },
    { label: "Broccoli", value: "broccoli", category: "Vegetables" },
    { label: "Spinach", value: "spinach", category: "Vegetables" },
    { label: "Potato", value: "potato", category: "Vegetables" },
    { label: "Tomato", value: "tomato", category: "Vegetables" },
    { label: "Milk", value: "milk", category: "Dairy" },
    { label: "Cheese", value: "cheese", category: "Dairy" },
    { label: "Yogurt", value: "yogurt", category: "Dairy" },
  ]

export default function CreateBlogPage() {
    const [selected, setSelected] = useState<Option[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            summary: '',
            tags: [],
            content: '',
        },
    });

    const [value, setValue] = useState<Content>('');

    function onSubmit(values: z.infer<typeof formSchema>) {
        // come in future
    }

    const handleTagSelect = (value: string) => {
        const currentTags = form.getValues('tags');
        if (!currentTags.includes(value)) {
            form.setValue('tags', [...currentTags, value], {
                shouldValidate: true,
            });
        }
    };

    const removeTag = (tag: string) => {
        const currentTags = form.getValues('tags');
        form.setValue(
            'tags',
            currentTags.filter((t) => t !== tag),
            { shouldValidate: true },
        );
    };

    return (
        <TooltipProvider>
            <div className="container py-10 mx-auto">
                <Card className="mx-auto max-w-4xl bg-white text-black border shadow-sm">
                    <CardHeader className="bg-white text-black">
                        <CardTitle className="text-3xl text-black">
                            Create New Blog Post
                        </CardTitle>
                        <CardDescription className="text-gray-500">
                            Fill in the details to create a new blog post
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="bg-white text-black">
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
                                            <FormLabel className="text-black">
                                                Title
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter blog post title"
                                                    className="bg-white text-black"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-gray-500">
                                                This will be the main title of
                                                your blog post.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="summary"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">
                                                Summary
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter a short excerpt"
                                                    className="bg-white text-black"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-gray-500">
                                                Enter a short summary
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">
                                                Tags
                                            </FormLabel>
                                            <FormControl>
                                                <MultiSelect options={options} selected={selected} onChange={setSelected} placeholder="Select blog tags..."/>
                                            </FormControl>
                                            <div className="mt-4">
                                                <h2 className="text-lg font-semibold mb-2">Selected items:</h2>
                                                <ul className="list-disc list-inside">
                                                    {selected.map((item) => (
                                                        <li key={item.value}>{item.label}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <FormDescription className="text-gray-500">
                                                Select relevant tags to
                                                categorize your blog post.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">
                                                Content
                                            </FormLabel>
                                            <FormControl>
                                                <MinimalTiptapEditor
                                                    value={value}
                                                    onChange={setValue}
                                                    className="w-full"
                                                    editorContentClassName="p-5"
                                                    output="html"
                                                    placeholder="Enter the content of the blog"
                                                    autofocus={false}
                                                    editable={true}
                                                    editorClassName="focus:outline-hidden"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-gray-500">
                                                The main content of your blog post
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-black text-white hover:bg-gray-800"
                                >
                                    Create Post
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    );
}
