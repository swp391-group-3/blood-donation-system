'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tag, TagInput } from 'emblor';
import { useCreateBlogFrom } from '@/hooks/use-create-blog';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
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
import { useState } from 'react';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
import { Content } from '@tiptap/react';
import { blogPostSchema } from '@/hooks/use-create-blog';
import { z } from 'zod';

export default function BlogCreatePage() {
    const { form, mutation } = useCreateBlogFrom();
    const [tags, setTags] = useState<Tag[]>([]);
    const [valueTipTap, setValueTipTap] = useState<Content>('');
    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
    const { setValue } = form;

    function onSubmit(data: z.infer<typeof blogPostSchema>) {
        const stringTags = tags.map((tag) => tag.text);

        const transformedData = {
            ...data,
            tags: stringTags,
        };

        console.log(transformedData);
        mutation.mutate(transformedData);
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-slate-50">
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <Link href="/blog">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-slate-100 rounded-xl"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Blog
                            </Button>
                        </Link>
                    </div>
                    <div className="container mx-auto py-8 px-4 max-w-4xl">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold">
                                        Basic Information
                                    </CardTitle>
                                    <CardDescription>
                                        Enter the title, description, and tags
                                        of your blog
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <Form {...form}>
                                        <div className="space-y-6">
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Title
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter the title of blog post"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Description
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Write a brief description of your blog post"
                                                                className="min-h-[100px]"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="tags"
                                                render={() => (
                                                    <FormItem className="flex flex-col items-start">
                                                        <FormLabel className="text-left">
                                                            Tags
                                                        </FormLabel>
                                                        <FormControl>
                                                            <TagInput
                                                                tags={tags}
                                                                setTags={(
                                                                    newTags,
                                                                ) => {
                                                                    const tagsArray =
                                                                        typeof newTags ===
                                                                        'function'
                                                                            ? newTags(
                                                                                  tags,
                                                                              )
                                                                            : newTags;

                                                                    setTags(
                                                                        tagsArray,
                                                                    );

                                                                    form.setValue(
                                                                        'tags',
                                                                        tagsArray.map(
                                                                            (
                                                                                tag,
                                                                            ) =>
                                                                                tag.text,
                                                                        ),
                                                                        {
                                                                            shouldValidate:
                                                                                true,
                                                                        },
                                                                    );
                                                                }}
                                                                activeTagIndex={
                                                                    activeTagIndex
                                                                }
                                                                setActiveTagIndex={
                                                                    setActiveTagIndex
                                                                }
                                                                placeholder="Enter blog tags..."
                                                                className="sm:min-w-[450px]"
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            These are the topics
                                                            of your blogs
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </Form>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold">
                                        Content
                                    </CardTitle>
                                    <CardDescription>
                                        Write the main content of your blog post
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(
                                                onSubmit,
                                            )}
                                            className="space-y-6"
                                        >
                                            <FormField
                                                control={form.control}
                                                name="content"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Content
                                                        </FormLabel>
                                                        <FormControl>
                                                            <MinimalTiptapEditor
                                                                value={
                                                                    valueTipTap
                                                                }
                                                                onChange={(
                                                                    newValue,
                                                                ) => {
                                                                    setValueTipTap(
                                                                        newValue,
                                                                    );

                                                                    if (
                                                                        typeof newValue ===
                                                                            'string' &&
                                                                        newValue.trim() !==
                                                                            ''
                                                                    ) {
                                                                        setValue(
                                                                            'content',
                                                                            newValue,
                                                                            {
                                                                                shouldValidate:
                                                                                    true,
                                                                            },
                                                                        );
                                                                    } else {
                                                                        setValue(
                                                                            'content',
                                                                            '',
                                                                            {
                                                                                shouldValidate:
                                                                                    true,
                                                                            },
                                                                        );
                                                                    }
                                                                }}
                                                                className="w-full"
                                                                editorContentClassName="p-5"
                                                                output="html"
                                                                placeholder="Enter your blog content..."
                                                                autofocus={
                                                                    false
                                                                }
                                                                editable={true}
                                                                editorClassName="focus:outline-hidden"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="flex justify-between items-center pt-4">
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    className="px-6"
                                                >
                                                    Create Blog Post
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </TooltipProvider>
    );
}
