'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { BloodBag, BloodComponent } from '@/lib/api/dto/blood-bag';
import { BloodGroup } from '@/lib/api/dto/blood-group';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

interface BloodStorageFilter {
    blood_group?: BloodGroup;
    component?: BloodComponent;
}

export const useBloodStorageList = (filters: BloodStorageFilter = {}) => {
    return useQuery({
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.blood_group)
                params.append('blood_group', filters.blood_group);
            if (filters.component)
                params.append('component', filters.component);

            const response = await fetchWrapper(
                `/blood-bag?${params.toString()}`,
            );
            return await deserialize<BloodBag[]>(response);
        },
        placeholderData: keepPreviousData,
        queryKey: ['blood-bag', filters],
    });
};
