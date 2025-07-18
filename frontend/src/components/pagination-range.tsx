import {
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from '@/components/ui/pagination';

interface Props {
    pageIndex: number;
    pageCount: number;
    onPageChange: (newPageIndex: number) => void;
}

export function PaginationRange({ pageIndex, pageCount, onPageChange }: Props) {
    const siblings = 1;

    const start = Math.max(0, pageIndex - siblings);
    const end = Math.min(pageCount - 1, pageIndex + siblings);

    const visiblePages: number[] = [];
    for (let i = start; i <= end; i++) {
        visiblePages.push(i);
    }

    return (
        <>
            {visiblePages.map((idx) => (
                <PaginationItem key={idx}>
                    <PaginationLink
                        aria-current={idx === pageIndex ? 'page' : undefined}
                        onClick={() => onPageChange(idx)}
                    >
                        {idx + 1}
                    </PaginationLink>
                </PaginationItem>
            ))}

            {end < pageCount - 1 && (
                <>
                    {end < pageCount - 2 && <PaginationEllipsis className='px-2' />}
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => onPageChange(pageCount - 1)}
                        >
                            {pageCount}
                        </PaginationLink>
                    </PaginationItem>
                </>
            )}
        </>
    );
}
