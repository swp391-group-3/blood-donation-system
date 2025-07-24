import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { PaginationState } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';

interface Props {
    className?: string;
    itemCount: number;
    pagination: PaginationState;
    setPagination: Dispatch<SetStateAction<PaginationState>>;
}

export const PaginationControl = ({
    className,
    itemCount,
    pagination,
    setPagination,
}: Props) => {
    const currentPage = useMemo(() => pagination.pageIndex + 1, [pagination]);
    const pageCount = useMemo(
        () => Math.ceil(itemCount / pagination.pageSize),
        [itemCount, pagination],
    );
    const start = useMemo(
        () => pagination.pageIndex * pagination.pageSize + 1,
        [pagination],
    );
    const end = useMemo(
        () =>
            Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                itemCount,
            ),
        [pagination],
    );

    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(pageCount - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < pageCount - 1) {
            rangeWithDots.push('...', pageCount);
        } else {
            if (pageCount > 1) {
                rangeWithDots.push(pageCount);
            }
        }

        return rangeWithDots.filter(
            (item, index, arr) => arr.indexOf(item) === index,
        );
    };

    const pageSizeOptions = [10, 20, 30, 50, 100];

    if (pageCount <= 1 && itemCount <= 10) return null;

    return (
        <div
            className={`flex flex-col lg:flex-row items-center justify-between gap-6 ${className || ''}`}
        >
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-sm text-gray-600 whitespace-nowrap">
                    Showing{' '}
                    <span className="font-semibold text-gray-900">{start}</span>{' '}
                    to{' '}
                    <span className="font-semibold text-gray-900">{end}</span>{' '}
                    of{' '}
                    <span className="font-semibold text-gray-900">
                        {itemCount}
                    </span>{' '}
                    results
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                        Rows per page:
                    </span>
                    <Select
                        value={pagination.pageSize.toString()}
                        onValueChange={(value) =>
                            setPagination((prev) => ({
                                ...prev,
                                pageSize: Number(value),
                                pageIndex: 0,
                            }))
                        }
                    >
                        <SelectTrigger className="w-20 h-8 border-gray-200">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {pageCount > 1 && (
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                        }
                        disabled={currentPage === 1}
                        className="h-9 w-9 p-0 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: Math.max(0, prev.pageIndex - 1),
                            }))
                        }
                        disabled={pagination.pageIndex === 0}
                        className="h-9 px-3 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                        {getPageNumbers().map((pageNumber, index) => (
                            <div key={index}>
                                {pageNumber === '...' ? (
                                    <span className="flex h-9 w-9 items-center justify-center text-sm text-gray-400 font-medium">
                                        ...
                                    </span>
                                ) : (
                                    <Button
                                        variant={
                                            currentPage === pageNumber
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        onClick={() =>
                                            setPagination((prev) => ({
                                                ...prev,
                                                pageIndex:
                                                    (pageNumber as number) - 1,
                                            }))
                                        }
                                        className={`h-9 w-9 p-0 text-sm font-semibold transition-all duration-200 ${
                                            currentPage === pageNumber
                                                ? 'bg-gray-900 text-white hover:bg-gray-800 border-gray-900 shadow-sm'
                                                : 'border-gray-200 hover:bg-gray-50 text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {pageNumber}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: Math.min(
                                    pageCount - 1,
                                    prev.pageIndex + 1,
                                ),
                            }))
                        }
                        disabled={pagination.pageIndex >= pageCount - 1}
                        className="h-9 px-3 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: pageCount - 1,
                            }))
                        }
                        disabled={currentPage === pageCount}
                        className="h-9 w-9 p-0 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {pageCount > 1 && (
                <div className="flex lg:hidden items-center justify-center mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-600">
                        Page{' '}
                        <span className="font-semibold text-gray-900">
                            {currentPage}
                        </span>{' '}
                        of{' '}
                        <span className="font-semibold text-gray-900">
                            {pageCount}
                        </span>
                    </span>
                </div>
            )}
        </div>
    );
};
