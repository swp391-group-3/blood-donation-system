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
import { Filter, Plus, Search, Tag } from 'lucide-react';
import Link from 'next/link';
import { Mode, useBlogList } from '@/hooks/use-blog-list';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Hero,
    HeroDescription,
    HeroKeyword,
    HeroTitle,
} from '@/components/hero';
import { useTagList } from '@/hooks/use-tag-list';
import { BlogCard } from '@/components/blog-card';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function BlogPage() {
    const [selectedTag, setSelectedTag] = useState<string>('all');
    const [search, setSearch] = useState<string | undefined>();
    const [sortOption, setSortOption] = useState<Mode | undefined>();
    const filter = useMemo(
        () => ({
            query: search,
            tag: selectedTag === 'all' ? undefined : selectedTag,
            mode: sortOption,
            page_size: 10,
        }),
        [search, selectedTag, sortOption],
    );
    const { items, next, hasMore } = useBlogList(filter);
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

                <InfiniteScroll
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    dataLength={items.length}
                    next={next}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                >
                    {items.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </InfiniteScroll>
            </main>
        </div>
    );
}
