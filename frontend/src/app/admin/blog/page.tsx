'use client';

import { useBlogList } from '@/hooks/use-blog-list';
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import { columns } from './column';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Blog } from '@/lib/api/dto/blog';
import { PaginationRange } from '@/components/pagination-render';

function BlogPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: blogs = [] } = useBlogList();

    const filterBlogs: Blog[] = useMemo(() => {
        return blogs.filter((blog) => {
            const searchTermLowerCase = searchTerm.toLowerCase();
            const match =
                blog.content.toLowerCase().includes(searchTermLowerCase) ||
                blog.title.toLowerCase().includes(searchTermLowerCase);
            return match;
        });
    }, [blogs, searchTerm]);
    const table = useReactTable({
        data: filterBlogs,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 5,
            },
        },
    });

    return (
        <div className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto p-8">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8 ">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Blog Management
                        </h1>
                        <p className="text-gray-600 mt-1">Manage Blogs</p>
                    </div>
                </div>
                {/* search */}
                <Card className="border-none">
                    <CardContent className="pt-6 px-0">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search by blog name"
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
                        <CardDescription>Manage Blogs</CardDescription>
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
                                <PaginationRange table={table} />
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
    );
}

export default BlogPage;
