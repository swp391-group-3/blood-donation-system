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
import { cn } from '@/lib/utils';

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
        <Pagination className={className}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange(pageIndex - 1);
                        }}
                        aria-disabled={pageIndex === 0}
                        className={
                            pageIndex === 0 ? 'opacity-50' : 'cursor-pointer'
                        }
                    />
                </PaginationItem>
                {visiblePages.map((idx) => (
                    <PaginationItem key={idx}>
                        <PaginationLink
                            className={
                                idx === pageIndex
                                    ? 'bg-gray-200 cursor-pointer'
                                    : 'cursor-pointer'
                            }
                            aria-current={
                                idx === pageIndex ? 'page' : undefined
                            }
                            onClick={() => onPageChange(idx)}
                        >
                            {idx + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {end < pageCount - 1 && (
                    <>
                        {end < pageCount - 2 && (
                            <PaginationEllipsis className="px-2" />
                        )}
                        <PaginationItem>
                            <PaginationLink
                                onClick={() => onPageChange(pageCount - 1)}
                            >
                                {pageCount}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                )}
                <PaginationItem>
                    <PaginationNext
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange(pageIndex + 1);
                        }}
                        aria-disabled={pageIndex == pageCount - 1}
                        className={
                            pageIndex === pageCount - 1
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};
