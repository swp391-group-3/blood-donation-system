import { Blog } from '@/lib/api/dto/blog';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AccountPicture } from './account-picture';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getExcerpt } from '@/lib/utils';
import { Badge } from './ui/badge';

interface Props {
    blog: Blog;
}

export const BlogCard = ({ blog }: Props) => {
    return (
        <Link href={`/blog/${blog.id}`}>
            <Card className="flex flex-col h-full border-zinc-200 rounded-lg shadow-sm transition-all duration-200">
                <CardHeader className="flex-1 pt-1 pb-2 px-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8">
                            <AccountPicture name={blog.owner} />
                        </div>
                        <div>
                            <div className="font-medium text-zinc-900 text-[15px]">
                                {blog.owner}
                            </div>
                            <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(
                                    new Date(blog.created_at),
                                    { addSuffix: true },
                                )}
                            </div>
                        </div>
                    </div>
                    <CardTitle className="block text-base font-semibold text-zinc-900 leading-snug mb-2 line-clamp-2 hover:text-blue-600">
                        {blog.title}
                    </CardTitle>
                    <CardContent className="p-0">
                        <p
                            className="text-sm text-zinc-600 leading-normal mb-3 line-clamp-3 min-h-[56px]"
                            dangerouslySetInnerHTML={{
                                __html: getExcerpt(blog.content),
                            }}
                        />
                    </CardContent>
                </CardHeader>
                <div className="flex-1 flex flex-col justify-end">
                    <div className="flex flex-wrap gap-1.5 px-5 pb-4">
                        {(Array.isArray(blog.tags) ? blog.tags.flat() : [])
                            .slice(0, 3)
                            .map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-zinc-50 text-zinc-700 border-zinc-200 text-xs px-2 py-0.5"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        {Array.isArray(blog.tags) &&
                            blog.tags.flat().length > 3 && (
                                <Badge
                                    variant="outline"
                                    className="bg-zinc-50 text-zinc-500 border-zinc-200 text-xs px-2 py-0.5"
                                >
                                    +{blog.tags.flat().length - 3}
                                </Badge>
                            )}
                    </div>
                </div>
            </Card>
        </Link>
    );
};
