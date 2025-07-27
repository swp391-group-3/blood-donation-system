import { Pagination } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export const useInfiniteScroll = <F, T>(
    filter: F,
    fetchData: (
        filter: F & {
            page_size?: number;
        },
        signal?: AbortSignal,
    ) => Promise<Pagination<T>>,
) => {
    const [items, setItems] = useState<T[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const abortControllerRef = useRef<AbortController | null>(null);
    const filterRef = useRef(filter);

    useEffect(() => {
        filterRef.current = filter;
    }, [filter]);

    const fetchDataWrapper = async (page: number) => {
        try {
            abortControllerRef.current?.abort();
            const controller = new AbortController();
            abortControllerRef.current = controller;

            const { data, element_count } = await fetchData({
                ...filter,
                page_index: page,
                signal: controller.signal,
            });
            if (controller.signal.aborted) return;

            setItems((prev) => {
                const newItems = [...prev, ...data];
                setHasMore(newItems.length < element_count);
                return newItems;
            });
        } catch (e) {
            if (e instanceof Error) {
                if (e.name !== 'AbortError') {
                    toast.error(e.message);
                    setHasMore(false);
                }
            }
        }
    };

    // data only need to be refreshed when filter changed not when fetchDataWrapper changed
    useEffect(() => {
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const fetchInitial = async () => {
            try {
                const { data, element_count } = await fetchData({
                    ...filterRef.current,
                    page_index: 0,
                    signal: controller.signal,
                });

                if (controller.signal.aborted) return;

                setItems(data);
                setHasMore(data.length < element_count);
                setPageIndex(0);
            } catch (e) {
                if (e instanceof Error && e.name !== 'AbortError') {
                    toast.error(e.message);
                    setHasMore(false);
                }
            }
        };

        setItems([]);
        setHasMore(true);
        fetchInitial();

        return () => controller.abort();
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

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
