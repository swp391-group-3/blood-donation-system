'use client';

import { deserialize, fetchWrapper } from '@/lib/api';
import { ChatMessage } from '@/lib/api/dto/chat';
import { useQuery } from '@tanstack/react-query';

export const useGetChatHistory = () => {
    return useQuery({
        queryFn: async () => {
            const response = await fetchWrapper('/chat');
            return await deserialize<ChatMessage[]>(response);
        },
        queryKey: ['chat'],
    });
};
