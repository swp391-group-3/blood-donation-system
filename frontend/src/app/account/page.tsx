"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Upload, UserPlus, Users } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { columns } from './column';
import { Account, mockAccounts } from '@/lib/api/dto/account';





function Page() {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);


    const filtersAccounts: Account[] = useMemo(() => {
        return mockAccounts.filter((account) => {
            const matchesSearch =
                account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchRole = roleFilter === "all" || account.role === roleFilter;

            return matchesSearch && matchRole;
        })
    }, [searchTerm, roleFilter]);


    const table = useReactTable({
        data: filtersAccounts,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 5
            }
        }
    });


    const stats = {
        total: filtersAccounts.length
    }
    const { pageIndex, pageSize } = table.getState().pagination;
    const pageCount = table.getPageCount();

    // build an array [1, 2, 3, …, pageCount]
    const pages = React.useMemo(
        () => Array.from({ length: pageCount }, (_, i) => i + 1),
        [pageCount]
    );
    return (
        <div className='flex-1 overflow-auto'>
            <div className="p-8">
                {/* HEADER */}
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <h1 className='text-3xl font-bold text-gray-900'>User Management</h1>
                        <p className='text-gray-600 mt-1'>Manage user accounts, roles, and permissions</p>
                    </div>
                    <div className='flex gap-2'>
                        <Dialog
                            open={isImportDialogOpen}
                            onOpenChange={(open) => {
                                setIsImportDialogOpen(open)
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button variant="outline" className='gap-2'>
                                    <Upload />
                                    Import CSV
                                </Button>
                            </DialogTrigger>
                            <DialogContent className='sm:max-w-[600px]'>
                                <DialogHeader>
                                    <DialogTitle>Import Users from CSV</DialogTitle>
                                    <DialogDescription>
                                        Upload a CSV file to bulk import users. Download the sample template to see the required format.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className=' space-y-4'>
                                    <div className='border-2 border-dashed p-6 border-gray-300 text-center rounded-lg'>
                                        <div className='space-y-2'>
                                            <Label
                                                htmlFor='csv-upload'
                                                className='cursor-pointer flex justify-center'
                                            >
                                                <span>
                                                    <Upload className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                                                </span>
                                                <Input
                                                    id="csv-upload"
                                                    accept='.csv'
                                                    type='file'
                                                    className='hidden'
                                                />
                                            </Label>
                                            <p className='text-sx text-gray-800'>
                                                CSV file with columns: name, email, role, status
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <UserPlus />
                                    Add User
                                </Button>
                            </DialogTrigger>
                        </Dialog>
                    </div>
                </div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>

                </div>
                {/* Filters and Search */}
                <Card className='mb-6'>
                    <CardContent className='pt-6'>
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <div className='relative flex-1'>
                                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                                <Input
                                    placeholder='Search users by name or email'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='pl-10'
                                />
                            </div>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className='w-full sm:w-[180px]'>
                                    <SelectValue
                                        placeholder="Filter by role"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>All Roles</SelectItem>
                                    <SelectItem value='admin'>Admin</SelectItem>
                                    <SelectItem value='member'>
                                        Member
                                    </SelectItem>
                                    <SelectItem value='staff'>
                                        Staff
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                        </div>
                    </CardContent>
                </Card>
                {/* USER TABLES */}
                <Card>
                    <CardHeader>
                        <CardTitle>Users ({filtersAccounts.length})</CardTitle>
                        <CardDescription>
                            Manage user accounts and their permissions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <TableRow
                                        key={headerGroup.id}
                                    >
                                        {headerGroup.headers.map(header => {
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map(row => {
                                    return (
                                        <TableRow key={row.id} style={{ backgroundColor: row.getIsSelected() ? '#e3f2fd' : 'white' }}>
                                            {row.getVisibleCells().map(cell => {
                                                return <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            })}
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>

                    {/* Pagination */}
                    <CardFooter>
                        <Pagination>
                            <PaginationContent>
                                {/* PREVIOUS */}
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            table.previousPage();
                                        }}
                                        aria-disabled={!table.getCanPreviousPage()}
                                        tabIndex={!table.getCanPreviousPage() ? -1 : undefined}
                                        className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : undefined}
                                    />
                                </PaginationItem>

                                {/* PAGE NUMBERS */}
                                {table.getPageOptions().map((pageIndex) => {
                                    const isCurrent = pageIndex === table.getState().pagination.pageIndex;
                                    return (
                                        <PaginationItem key={pageIndex}>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    table.setPageIndex(pageIndex);
                                                }}
                                                aria-current={isCurrent ? "page" : undefined}
                                            >
                                                {pageIndex + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                {/* NEXT */}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            table.nextPage();
                                        }}
                                        aria-disabled={!table.getCanNextPage()}
                                        tabIndex={!table.getCanNextPage() ? -1 : undefined}
                                        className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined}
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

export default Page