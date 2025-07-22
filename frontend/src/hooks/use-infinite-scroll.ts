import { Pagination } from '@/lib/api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const useInfiteScroll = <F, T>(
    filter: F,
    fetchData: (filter: F & { page_size?: number }) => Promise<Pagination<T>>,
) => {
    const [items, setItems] = useState<T[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchDataWrapper = async (page: number) => {
        try {
            const { data, element_count } = await fetchData({
                ...filter,
                page_index: page,
            });

            setItems((prev) => [...prev, ...data]);
            setHasMore(items.length + data.length < element_count);
        } catch (e) {
            if (e instanceof Error) toast.error(e.message);

            setHasMore(false);
        }
    };

    useEffect(() => {
        setItems([]);
        setPageIndex(0);
        setHasMore(true);
        fetchDataWrapper(0);
    }, [filter]);

    return {
        items,
        hasMore,
        next: () => {
            const next = pageIndex + 1;
            setPageIndex(next);
            fetchDataWrapper(next);
        },
    };
};
