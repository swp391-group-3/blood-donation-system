'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteBlog } from '@/hooks/use-delete-blog';
import { Blog } from '@/lib/api/dto/blog';
import { createColumnHelper } from '@tanstack/react-table';
import { MoreHorizontal, Trash2 } from 'lucide-react';

const columnHelper = createColumnHelper<Blog>();

export const columns = [
    columnHelper.accessor('title', {
        id: 'Title',
        header: 'Title',
        cell: ({ row }) => {
            const blog = row.original;
            return (
                <div>
                    <div className="text-sm text-gray-500">{blog.title}</div>
                </div>
            );
        },
    }),
    columnHelper.accessor('description', {
        id: 'Description',
        header: 'Description',
        cell: ({ row }) => {
            const blog = row.original;
            return (
                <div>
                    <div className="text-sm text-gray-500">
                        {blog.description}
                    </div>
                </div>
            );
        },
    }),
    columnHelper.accessor('owner', {
        id: 'Owner',
        header: 'Owner',
        cell: ({ row }) => {
            const blog = row.original;
            return (
                <div>
                    <div className="text-sm text-gray-500">{blog.owner}</div>
                </div>
            );
        },
    }),
    columnHelper.display({
        id: 'Actions',
        header: 'Actions',
        cell: ({ row }) => {
            const blog = row.original;
            return (
                <div>
                    <BlogActionsCell blog={blog} />
                </div>
            );
        },
    }),
];

function BlogActionsCell({ blog }: { blog: Blog }) {
    const deleteMutation = useDeleteBlog();

    const handleDeleteBlog = (id: string) => {
        deleteMutation.mutate(id);
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                side="bottom"
                sideOffset={8}
                alignOffset={4}
            >
                {/* DELETE */}
                <DropdownMenuItem
                    onSelect={() => {
                        handleDeleteBlog(blog.id);
                    }}
                >
                    <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                    Delete Blog
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
