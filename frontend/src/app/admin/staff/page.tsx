"use client";
import React from 'react'
import {
    ColumnDef,
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table'
import { useState } from 'react'
import { helperColumns } from './column';
import { mockAccounts } from '../../../../constants/sample-data';



function Page() {
    const [data, setData] = useState(mockAccounts);
    const [globalFilter, setGlobalFilter] = useState('')

    const table = useReactTable({
        data,
        columns: helperColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter
        },
        onGlobalFilterChange: setGlobalFilter,
        initialState: {
            pagination: {
                pageSize: 5,
                pageIndex: 0
            }
        }
    })



    return (
        <div style={{ padding: '20px' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                console.log("Name", header.column.columnDef.header);
                                console.log("Size", header.column.getSize());
                                return (
                                    <th
                                        key={header.id}
                                        style={{
                                            width: `${header.column.getSize()}px`,
                                            border: '1px solid #ccc',
                                            padding: '8px',
                                            backgroundColor: '#f5f5f5',
                                            cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                        }}
                                    >
                                        {header.isPlaceholder ? null : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} style={{ backgroundColor: row.getIsSelected() ? '#e3f2fd' : 'white' }}>
                            {row.getVisibleCells().map(cell => (
                                <td
                                    key={cell.id}
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '8px',
                                    }}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination */}
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <span>
                    Page {table.getState().pagination.pageIndex + 1} of {' '} {table.getPageCount()}
                </span>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
            </div>
        </div>
    )
}

export default Page