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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Search, Shield, Upload, UserCheck, UserPlus, Users, UserX } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { columns } from './column';

// mock data
type Role = "ADMIN" | "MEMBER" | "STAFF";
type Gender = "MALE" | "FEMALE" | "OTHER";
type Status = "ACTIVE" | "INACTIVE";

export class Account {
    constructor(
        public id: string,
        public role: Role,
        public email: string,
        public phone: string,
        public name: string,
        public gender: Gender,
        public status: Status,
        public created_at: string,
    ) { }
}

const mockAccounts: Account[] = [
    new Account('1', 'ADMIN', 'alice.admin@example.com', '0123456789', 'Alice Nguyen', 'FEMALE', 'ACTIVE', '2023-01-10'),
    new Account('2', 'MEMBER', 'bob.member@example.com', '0987654321', 'Bob Tran', 'MALE', 'INACTIVE', '2023-02-15'),
    new Account('3', 'STAFF', 'charlie.staff@example.com', '0111222333', 'Charlie Pham', 'OTHER', 'INACTIVE', '2023-03-20'),
    new Account('4', 'MEMBER', 'diana.member@example.com', '0223344556', 'Diana Le', 'FEMALE', 'ACTIVE', '2023-04-05'),
    new Account('5', 'ADMIN', 'edward.admin@example.com', '0334455667', 'Edward Hoang', 'MALE', 'ACTIVE', '2023-05-12'),
    new Account('6', 'STAFF', 'fiona.staff@example.com', '0445566778', 'Fiona Vo', 'FEMALE', 'INACTIVE', '2023-06-25'),
    new Account('7', 'MEMBER', 'george.member@example.com', '0556677889', 'George Do', 'MALE', 'INACTIVE', '2023-07-01'),
    new Account('8', 'STAFF', 'hannah.staff@example.com', '0667788990', 'Hannah Bui', 'FEMALE', 'ACTIVE', '2023-08-17'),
    new Account('9', 'MEMBER', 'ian.member@example.com', '0778899001', 'Ian Dinh', 'MALE', 'ACTIVE', '2023-09-30'),
    new Account('10', 'ADMIN', 'julia.admin@example.com', '0889900112', 'Julia Ly', 'FEMALE', 'INACTIVE', '2023-10-08'),
];


function Page() {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [status, setStatus] = useState("all");
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);


    const filtersAccounts: Account[] = useMemo(() => {
        return mockAccounts.filter((account) => {
            const matchesSearch =
                account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchRole = roleFilter === "all" || account.role === roleFilter;

            const matchStatus = status === "all" || account.status === status

            return matchesSearch && matchRole && matchStatus;
        })
    }, [searchTerm, roleFilter, status]);


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

    console.log("RENDER");
    



    const stats = {
        total: filtersAccounts.length,
        active: filtersAccounts.filter((u) => u.status === "ACTIVE").length,
        inactive: filtersAccounts.filter((u) => u.status === "INACTIVE").length,
    }

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
                                console.log("OPEN");

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
                                                // onChange={(e) => {
                                                //     const file = e.target.files?.[0] || null;
                                                //     setCsvFile(file);
                                                //     // TODO: parse CSV, setCsvData, move to preview step
                                                // }}
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
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active</CardTitle>
                            <UserCheck className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                            <UserX className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
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
                                    <SelectItem value='ADMIN'>Admin</SelectItem>
                                    <SelectItem value='MEMBER'>
                                        Member
                                    </SelectItem>
                                    <SelectItem value='STAFF'>
                                        Staff
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue
                                        placeholder="Filter by status"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>All Status</SelectItem>
                                    <SelectItem value='ACTIVE'>Active</SelectItem>
                                    <SelectItem value='INACTIVE'>Inactive</SelectItem>
                                    <SelectItem value='SUSPENDED'>
                                        Suspended
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
                </Card>
            </div>
        </div>
    )
}

export default Page