"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Upload, UserPlus, Users } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { columns } from './column';
import { Account } from '@/lib/api/dto/account';
import FileUpload, { DropZone, FileError, FileInfo, FileList, FileProgress } from '@/components/file-upload';
import { useCreateStaffAccount } from '@/hooks/use-create-staff-account';
import { MessageLoading } from '@/components/ui/message-loading';
import { useAllAccounts } from '@/hooks/use-all-account';

function Page() {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [uploadFiles, setUploadFiles] = useState<FileInfo[]>([]);
    const { mutate, status } = useCreateStaffAccount();
    const { data: accounts = [] } = useAllAccounts();
    
    useEffect(() => {
        if (status === 'success') {
            setIsImportDialogOpen(false);
        }
    }, [status]);

    const onFileSelectChange = (files: FileInfo[]) => {
        setUploadFiles(prev => {
            if (files.length > 1) {
                return files.slice(0, 3);
            } else if (files.length === 1) {
                const newFile = files[0];
                if (prev.some(f => f.id === newFile.id)) {
                    return prev;
                }
                const combined = [...prev, newFile];
                return combined.slice(0, 3);
            } else {
                return prev;
            }
        });
    };
    const handleUpload = () => {
        const files: File[] = uploadFiles.map(fil => fil.file);
        mutate(files)
        setUploadFiles([])
    }

    const onRemove = (fileId: string) => {
        setUploadFiles(uploadFiles.filter(file => file.id !== fileId))
    }

    const filtersAccounts: Account[] = useMemo(() => {
        return accounts.filter((account) => {
            const matchesSearch =
                account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchRole = roleFilter === "all" || account.role === roleFilter;

            return matchesSearch && matchRole;
        })
    }, [searchTerm, roleFilter, accounts]);
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
                                        Upload a CSV file to bulk import users
                                    </DialogDescription>
                                </DialogHeader>

                                <FileUpload
                                    files={uploadFiles}
                                    onFileSelectChange={onFileSelectChange}
                                    multiple={true}
                                    accept=".csv"
                                    maxSize={10}
                                    maxCount={3}
                                    className="mt-2"
                                    disabled={false}
                                >
                                    <div className="space-y-4">
                                        <DropZone prompt="click or drop, 3 file to upload" />
                                        <FileError />
                                        <FileProgress />
                                        <FileList onClear={() => { setUploadFiles([]) }}
                                            onRemove={onRemove}
                                            canResume={true} />
                                        <div className='flex justify-center'>
                                            {uploadFiles.length > 0 && (
                                                <Button disabled={status === 'pending'} onClick={handleUpload} className='px-10'>
                                                    {status === 'pending' ? 'Uploading…' : 'Upload'}
                                                </Button>
                                            )}
                                            {(status === "pending") && (<MessageLoading />)}
                                        </div>
                                    </div>
                                </FileUpload>
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
                            <CardTitle className="text-sm font-medium ">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{accounts.length}</div>
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
