import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { Button } from './ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from './ui/pagination';

interface Props {
    className?: string;
    pageIndex: number;
    pageCount: number;
    onPageChange: (newPageIndex: number) => void;
}

export const PaginationControl = ({
    className,
    pageIndex,
    pageCount,
    onPageChange,
}: Props) => {
    const siblings = 1;

    const start = Math.max(0, pageIndex - siblings);
    const end = Math.min(pageCount - 1, pageIndex + siblings);

    const visiblePages: number[] = [];
    for (let i = start; i <= end; i++) {
        visiblePages.push(i);
    }

    return (
        <div className="flex items-center">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => onPageChange(0)}
                disabled={pageIndex === 0}
            >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => onPageChange(pageIndex - 1)}
                disabled={pageIndex === 0}
            >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center mx-2">
                {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                    let pageNumber;
                    if (pageCount <= 5) {
                        pageNumber = i;
                    } else {
                        const middlePoint = Math.min(
                            Math.max(2, pageIndex),
                            pageCount - 3,
                        );
                        pageNumber = i + Math.max(0, middlePoint - 2);
                    }

                    const isActive = pageNumber === pageIndex;

                    return (
                        <Button
                            key={pageNumber}
                            variant="ghost"
                            size="sm"
                            className={`h-8 min-w-[32px] rounded-md px-3 text-sm font-medium ${
                                isActive
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                            onClick={() => onPageChange(pageNumber)}
                        >
                            {pageNumber + 1}
                        </Button>
                    );
                })}
                {pageCount > 5 && (
                    <>
                        <span className="mx-1 text-gray-400">...</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 min-w-[32px] rounded-md px-3 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            onClick={() => onPageChange(pageCount - 1)}
                        >
                            {pageCount}
                        </Button>
                    </>
                )}
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => onPageChange(pageIndex - 1)}
                disabled={pageIndex === pageCount - 1}
            >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => onPageChange(Math.max(pageCount - 1, 0))}
                disabled={pageIndex === pageCount - 1}
            >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
            </Button>
        </div>
    );
};
