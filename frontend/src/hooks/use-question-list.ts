'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { Question } from '@/lib/api/dto/question';
import { useQuery } from '@tanstack/react-query';

export const useQuestionList = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper('/question');

            return await deserialize<Question[]>(response);
        },
        queryKey: ['question'],
    });
};
