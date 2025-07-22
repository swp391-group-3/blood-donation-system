'use client';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
} from '@/components/ui/select';
import { Clock, Filter, Plus, Search, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountPicture } from '@/components/account-picture';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Mode, useBlogList } from '@/hooks/use-blog-list';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Hero,
    HeroDescription,
    HeroKeyword,
    HeroTitle,
} from '@/components/hero';
import { useTagList } from '@/hooks/use-tag-list';

const getTimeAgo = (date: Date): string => {
    return formatDistanceToNow(date, { addSuffix: true });
};

const getExcerpt = (content: string, maxLength = 100): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
};

export default function BlogPage() {
    const [selectedTag, setSelectedTag] = useState<string>('all');
    const [search, setSearch] = useState<string | undefined>();
    const [sortOption, setSortOption] = useState<Mode | undefined>();
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const {
        data: blogs,
        isLoading,
        error,
    } = useBlogList({
        query: search,
        tag: selectedTag === 'all' ? undefined : selectedTag,
        mode: sortOption,
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
    });
    const { data: tags } = useTagList();

    return (
        <div>
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12">
                    <Hero>
                        <HeroTitle>
                            Explore Our
                            <HeroKeyword color="blue">Blog Posts</HeroKeyword>
                        </HeroTitle>
                        <HeroDescription>
                            Discover insights, tips, and stories from our latest
                            blog articles
                        </HeroDescription>
                    </Hero>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                        <Input
                            placeholder="Search blogs..."
                            type="search"
                            className="pl-11 border-zinc-200"
                            value={search ?? ''}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select onValueChange={(value) => setSelectedTag(value)}>
                        <SelectTrigger className="w-full sm:w-40 border-zinc-200 rounded">
                            <Tag className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="All Tags" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All Tags</SelectItem>
                                {tags &&
                                    tags.map((tag) => (
                                        <SelectItem
                                            key={tag.id}
                                            value={tag.name}
                                        >
                                            {tag.name}
                                        </SelectItem>
                                    ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select
                        value={sortOption}
                        onValueChange={(value: Mode) => setSortOption(value)}
                    >
                        <SelectTrigger className="w-full sm:w-45 h-11 border-zinc-200 rounded">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="MostRecent">
                                    Most Recent
                                </SelectItem>
                                <SelectItem value="OldestFirst">
                                    Oldest First
                                </SelectItem>
                                <SelectItem value="TitleAZ">
                                    Title A-Z
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Link href="/blog/new">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Write Blog
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs &&
                        blogs.data.map((blog) => (
                            <Link key={blog.id} href={`/blog/${blog.id}`}>
                                <Card className="flex flex-col h-full border-zinc-200 rounded-lg shadow-sm transition-all duration-200">
                                    <CardHeader className="flex-1 pt-1 pb-2 px-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="h-8 w-8">
                                                <AccountPicture
                                                    name={blog.owner}
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium text-zinc-900 text-[15px]">
                                                    {blog.owner}
                                                </div>
                                                <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                                                    <Clock className="h-3 w-3" />
                                                    {getTimeAgo(
                                                        blog.created_at,
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
                                                    __html: getExcerpt(
                                                        blog.content,
                                                    ),
                                                }}
                                            />
                                        </CardContent>
                                    </CardHeader>
                                    <div className="flex-1 flex flex-col justify-end">
                                        <div className="flex flex-wrap gap-1.5 px-5 pb-4">
                                            {(Array.isArray(blog.tags)
                                                ? blog.tags.flat()
                                                : []
                                            )
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
                                                        +
                                                        {blog.tags.flat()
                                                            .length - 3}
                                                    </Badge>
                                                )}
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                </div>
            </main>
        </div>
    );
}
