import { Input } from '@/components/ui/input'
import { Select, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SelectContent } from '@radix-ui/react-select'
import { BookOpen, ChevronRight, Clock, Filter, Search, Tag } from 'lucide-react'
import { blogs } from "../../../constants/sample-data"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { AccountPicture } from "@/components/account-picture"
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function BlogPage() {
    const alltTags = Array.from(new Set(blogs.flatMap((blog) => blog.tags)))

    const getTimeAgo = (date : Date): string => {
        return formatDistanceToNow(date, {addSuffix: true})
    }

    const getExcerpt = (content: string, maxLength = 100): string => {
        if(content.length <= maxLength) return content
        return content.substring(0, maxLength).trim() + "..."
    }
    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <BookOpen  className="w-4 h-4 text-blue-500"/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900">Community Blog</h1>
                        <p className="text-zinc-600">Stories and insights from our blood donation community</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4"/>
                    <Input 
                        placeholder="Search blogs..."
                        type="search"
                        className="pl-11 border-zinc-200"
                    />
                </div>
                <Select>
                    <SelectTrigger className="w-full sm:w-40 border-zinc-200 rounded">
                        <Tag className="h-4 w-4 mr-2"/>
                        <SelectValue placeholder="All Tags" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {alltTags.map((tag) => (
                                <SelectItem key={tag} value={tag}>
                                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                    <Select>
                        <SelectTrigger className="w-full sm:w-40 h-11 border-zinc-200 rounded">
                            <Filter className="h-4 w-4 mr-2"/>
                            <SelectValue placeholder="Sort By"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="recent">Most Recent</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="title">Title A-Z</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <Card
                        key={blog.id}
                        className="transition-all duration-200 border-zinc-200 rounded-xl overflow-hidden h-fit"
                    >
                        <CardHeader className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-8 w-8">
                                    <AccountPicture name={blog.owner}></AccountPicture>
                                </div>
                                <div>
                                    <div className="font-medium text-zinc-900 text-sm">
                                        {blog.owner}
                                    </div>
                                    <div className="text-xs text-zinc-500 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {getTimeAgo(blog.created_at)}
                                    </div>
                                </div>
                            </div>
                            <CardTitle className="text-lg font-bold text-zinc-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {blog.title}
                            </CardTitle>  
                            <CardContent>
                                <p className="text-sm text-zinc-600 leading-relaxed mb-4 line-clamp-3">
                                    {getExcerpt(blog.content)}
                                </p>
                                
                            </CardContent>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {blog.tags.slice(0,3).map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="bg-zinc-50 text-zinc-700 border-zinc-200 text-xs px-2 py-1"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                                {blog.tags.length > 3 && (
                                    <Badge
                                        variant="outline"
                                        className="bg-zinc-50 text-zinc-500 border-zinc-200 text-xs px-2 py-1"
                                    >
                                        +{blog.tags.length - 3}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <Link
                                href={`/blog/read/${blog.id}`}
                            >
                                <Button variant="outline" className="w-full border-zinc-200 hover:bg-zinc-50 rounded-xl">
                                    Read Blog
                                    <ChevronRight className="w-4 h-4"/>
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}

            </div>
        </main>
    )
}