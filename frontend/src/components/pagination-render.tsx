import { PaginationItem, PaginationLink } from "./ui/pagination";
import { Table } from "@tanstack/react-table"

interface PaginationRangeProps<T> {
    table: Table<T>
}


export function PaginationRange<T>({ table }: PaginationRangeProps<T>) {
    const { pageIndex } = table.getState().pagination
    const pageCount = table.getPageCount()
    const siblings = 1

    const start = Math.max(0, pageIndex - siblings)
    const end = Math.min(pageCount - 1, pageIndex + siblings)

    const visiblePages: number[] = []
    for (let i = start; i <= end; i++) {
        visiblePages.push(i)
    }

    return (
        <>
            {visiblePages.map(idx => (
                <PaginationItem key={idx}>
                    <PaginationLink
                        aria-current={idx === pageIndex ? 'page' : undefined}
                        onClick={() => table.setPageIndex(idx)}
                    >
                        {idx + 1}
                    </PaginationLink>
                </PaginationItem>
            ))}

            {end < pageCount - 1 && (
                <>
                    {end < pageCount - 2 && <span className="px-2">…</span>}
                    <PaginationItem>
                        <PaginationLink onClick={() => table.setPageIndex(pageCount - 1)}>
                            {pageCount}
                        </PaginationLink>
                    </PaginationItem>
                </>
            )}
        </>
    )
}