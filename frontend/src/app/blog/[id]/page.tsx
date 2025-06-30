'use client';

import { useState } from 'react';
import { ArrowLeft, Clock, MessageSquare, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Content } from '@tiptap/react';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useBlog } from '@/hooks/use-blog';
import { useParams } from 'next/navigation';
import { AccountPicture } from '@/components/account-picture';
import { useComment } from '@/hooks/use-comment';
import { TooltipProvider } from '@/components/ui/tooltip';
import { usePostComment } from '@/hooks/use-post-comment';

export default function BlogReadPage() {
    const params = useParams();
    const id = params?.id as string;
    const { data: blog, isLoading, error } = useBlog(id);
    const { data: comments } = useComment(id);
    const { mutation } = usePostComment(id);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [value, setValue] = useState<Content>('');

    const getTimeAgo = (date: Date | string): string => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    const handleSubmitComment = async () => {
        mutation.mutate(value as string);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading blog.</div>;
    if (!blog) return <p>No blog data</p>;
    if (!comments) return <div>No comment data</div>;

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

                    <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                        <div className="p-8 pb-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10">
                                    <AccountPicture name={blog.owner} />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900">
                                        {blog.owner}
                                    </div>
                                    <div className="text-sm text-slate-500 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Published {getTimeAgo(blog.created_at)}
                                    </div>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                                {blog.title}
                            </h1>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {blog.tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        <span>By {blog.owner}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="p-8">
                            <div className="text-slate-700 leading-relaxed space-y-6">
                                {blog.content}
                            </div>
                        </div>
                    </article>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 mt-10">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                Comments
                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                    {comments.length}
                                </span>
                            </h2>
                        </div>

                        <Separator className="mt-2" />

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 text-xl">
                                    <AccountPicture name={blog.owner} />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <MinimalTiptapEditor
                                        value={value}
                                        onChange={setValue}
                                        className="w-full h-full min-h-40"
                                        editorContentClassName="p-5"
                                        output="html"
                                        placeholder="Share your think..."
                                        autofocus={false}
                                        editable={true}
                                        editorClassName="focus:outline-hidden"
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleSubmitComment}
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700 rounded-lg"
                                            disabled={
                                                !value?.toString().trim() ||
                                                isSubmitting
                                            }
                                        >
                                            <Send className="h-4 w-4 mr-2" />
                                            {isSubmitting
                                                ? 'Posting...'
                                                : 'Post Comment'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {comments?.map((comment) => (
                            <div
                                key={comment.id}
                                className="flex items-start gap-3"
                            >
                                <div className="w-8 h-8">
                                    <AccountPicture name={comment.owner} />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-slate-900">
                                            {comment.owner}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {getTimeAgo(comment.created_at)}
                                        </span>
                                    </div>
                                    <p
                                        className="text-slate-700 leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html: comment.content,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </TooltipProvider>
    );
}
