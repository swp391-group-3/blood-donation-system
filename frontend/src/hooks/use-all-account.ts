import { buildParams, deserialize, fetchWrapper, Pagination } from '@/lib/api';
import { Account, Role } from '@/lib/api/dto/account';
import { useQuery } from '@tanstack/react-query';

interface Filter {
    query?: string;
    role?: Role;
    page_size?: number;
    page_index?: number;
}

export const useAllAccounts = (filter: Filter) => {
    const params = buildParams(filter);

    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper(
                `/account?${params.toString()}`,
            );

            return await deserialize<Pagination<Account>>(response);
        },
        queryKey: ['account', filter],
    });
};
