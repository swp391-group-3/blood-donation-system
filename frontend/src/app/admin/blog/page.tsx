"use client"
import { useBlogList } from '@/hooks/use-blog-list'
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import { columns } from './column';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { BookPlus, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Blog } from '@/lib/api/dto/blog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateBlogFrom } from '@/hooks/use-create-blog';
import { Textarea } from '@/components/ui/textarea';
import { Tag, TagInput } from 'emblor';



function BlogPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: blogs = [] } = useBlogList();

    // for adding blog
    const [isAddBlog, setIsAddBlog] = useState(false);
    const { mutation: mutationBlog, form: formBlog } = useCreateBlogFrom();
    const [tags, setTags] = useState<Tag[]>([]);
    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

    const filterBlogs: Blog[] = useMemo(() => {
        return blogs.filter((blog) => {
            console.log(searchTerm);

            const searchTermLowerCase = searchTerm.toLowerCase()
            const match = blog.content.toLowerCase().includes(searchTermLowerCase)
                || blog.title.toLowerCase().includes(searchTermLowerCase)
            return match;
        })
    }, [blogs, searchTerm])
    const table = useReactTable({
        data: filterBlogs,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 5,
            }
        }
    })

    return (
        <div>
            <div className='max-w-6xl mx-auto'>
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8 ">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            User Management
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage user accounts, roles, and permissions
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isAddBlog} onOpenChange={setIsAddBlog}>
                            <DialogTrigger asChild>
                                <Button>
                                    <BookPlus /> Add Blog
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Staff Account</DialogTitle>
                                </DialogHeader>
                                <Form {...formBlog}>
                                    <form
                                        autoComplete="off"
                                        onSubmit={formBlog.handleSubmit(
                                            (values) =>
                                                mutationBlog.mutate(values),
                                        )}
                                    >
                                        <div className="space-y-6">
                                            <FormField
                                                control={formBlog.control}
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
                                                control={formBlog.control}
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
                                                control={formBlog.control}
                                                name="tags"
                                                render={() => (
                                                    <FormItem className="flex flex-col items-start">
                                                        <FormLabel className="text-left">
                                                            Tags
                                                        </FormLabel>
                                                        <FormControl>
                                                            <TagInput
                                                                tags={tags}
                                                                setTags={(newTags) => {
                                                                    console.log(newTags);
                                                                    const tagsArray = typeof newTags === 'function'
                                                                        ? newTags(tags)
                                                                        : newTags;
                                                                    setTags(tagsArray);
                                                                    formBlog.setValue('tags',
                                                                        tagsArray.map((tag) => tag.text),
                                                                        { shouldValidate: true },
                                                                    );
                                                                }}
                                                                activeTagIndex={activeTagIndex}
                                                                setActiveTagIndex={setActiveTagIndex}
                                                                placeholder="Enter blog tags..."
                                                                className="sm:min-w-[450px]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {mutationBlog.status ===
                                                'pending' ? (
                                                <Button
                                                    disabled
                                                    className="w-full py-5"
                                                >
                                                    <Loader2 className="animate-spin" />
                                                    Loading
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    className="w-full py-5"
                                                >
                                                    Add Blog
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                {/* search */}
                <Card className="mb-6 border-none">
                    <CardContent className="pt-6 px-0">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search blog name"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>

                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Blog</CardTitle>
                        <CardDescription>
                            Manage Blogs
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => {
                                    return (
                                        <TableRow
                                            key={row.id}
                                            style={{
                                                backgroundColor:
                                                    row.getIsSelected()
                                                        ? '#e3f2fd'
                                                        : 'white',
                                            }}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => {
                                                    return (
                                                        <TableCell
                                                            key={cell.id}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </TableCell>
                                                    );
                                                })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            table.previousPage();
                                        }}
                                        aria-disabled={
                                            !table.getCanPreviousPage()
                                        }
                                        tabIndex={
                                            !table.getCanPreviousPage()
                                                ? -1
                                                : undefined
                                        }
                                        className={
                                            !table.getCanPreviousPage()
                                                ? 'pointer-events-none opacity-50'
                                                : undefined
                                        }
                                    />
                                </PaginationItem>
                                {/* NUMBERS */}
                                {table.getPageOptions().map((pageIndex) => {
                                    const isCurrent =
                                        pageIndex ===
                                        table.getState().pagination.pageIndex;
                                    return (
                                        <PaginationItem key={pageIndex}>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    table.setPageIndex(
                                                        pageIndex,
                                                    );
                                                }}
                                                aria-current={
                                                    isCurrent
                                                        ? 'page'
                                                        : undefined
                                                }
                                            >
                                                {pageIndex + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            table.nextPage();
                                        }}
                                        aria-disabled={!table.getCanNextPage()}
                                        tabIndex={
                                            !table.getCanNextPage()
                                                ? -1
                                                : undefined
                                        }
                                        className={
                                            !table.getCanNextPage()
                                                ? 'pointer-events-none opacity-50'
                                                : undefined
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default BlogPage