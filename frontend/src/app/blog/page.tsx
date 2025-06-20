import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SelectContent } from '@radix-ui/react-select'
import { BookOpen, Search, Tag } from 'lucide-react'
import { blogs } from "../../../constants/sample-data"

export default function BlogPage() {
    const alltTags = Array.from(new Set(blogs.flatMap((blog) => blog.tags)))

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
                        

                    </SelectContent>
                </Select>
            </div>

        </main>
    )
}