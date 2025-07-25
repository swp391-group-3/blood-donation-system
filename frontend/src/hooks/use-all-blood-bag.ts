import { buildParams, deserialize, fetchWrapper, Pagination } from '@/lib/api';
import { BloodBag, BloodComponent } from '@/lib/api/dto/blood-bag';
import { BloodGroup } from '@/lib/api/dto/blood-group';
import { useQuery } from '@tanstack/react-query';

export const modes = ['Compatible', 'Exact'];
export type Mode = (typeof modes)[number];

export interface Filter {
    blood_group?: BloodGroup;
    component?: BloodComponent;
    mode?: Mode;
    page_size?: number;
    page_index?: number;
}

export const useAllBloodBag = (filter: Filter) => {
    const params = buildParams(filter);

    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper(
                `/blood-bag?${params.toString()}`,
            );

            return await deserialize<Pagination<BloodBag>>(response);
        },
        queryKey: ['blood-bag', filter],
    });
};
