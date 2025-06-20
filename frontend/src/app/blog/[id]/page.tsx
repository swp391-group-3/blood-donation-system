'use client';
import { useState } from 'react';
import { Content } from '@tiptap/react';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, MessageCircle, Send } from 'lucide-react';
import { post, comments } from '../../../../constants/sample-data';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function BlogPostPage() {
    const [value, setValue] = useState<Content>('');

    return (
        <TooltipProvider>
            <div className="max-w-5xl mx-auto space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/member/blog">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Blog
                        </Link>
                    </Button>
                </div>
                <Card className="p-10">
                    <CardHeader className="space-y-4">
                        <CardTitle className="text-3xl">{post.title}</CardTitle>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            {post.author.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">
                                        {post.author.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(
                                        post.publishedAt,
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div
                            className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-700 prose-li:text-gray-700 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:italic"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
                            {post.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs"
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="p-10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Comments ({comments.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <MinimalTiptapEditor
                                value={value}
                                onChange={setValue}
                                className="w-full"
                                editorContentClassName="p-5"
                                output="html"
                                placeholder="Share your though..."
                                autofocus={true}
                                editable={true}
                                editorClassName="focus:outline-hidden"
                            />
                            <div className="flex justify-end">
                                <Button>
                                    <Send className="h-4 w-4 mr-2" />
                                    Post Comment
                                </Button>
                            </div>
                        </div>
                        <Separator />

                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <div key={comment.id} className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-sm">
                                                {comment.author.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {comment.author.name}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${comment.author.role === 'staff' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-green-50 text-green-700 border-green-200'}`}
                                                >
                                                    {comment.author.role}
                                                </Badge>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(
                                                        comment.publishedAt,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {comments.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>
                                    No comments yet. Be the first to share your
                                    thoughts!
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    );
}
