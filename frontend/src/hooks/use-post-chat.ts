'use client';

import { fetchWrapper, throwIfError } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ChatMessage } from '@/lib/api/dto/chat';

export const usePostChat = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ChatMessage, Error, string>({
        mutationFn: async (message: string) => {
            const response = await fetchWrapper('/chat', {
                method: 'POST',
                headers: {
                    Accept: 'text/plain',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: message }),
            });

            await throwIfError(response);

            const text = await response.text();

            const chatMessage: ChatMessage = {
                role: 'assistant',
                content: [{ type: 'text', text }],
            };

            return chatMessage;
        },
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            toast.success('Sent message successfully');
            queryClient.invalidateQueries({
                queryKey: ['chat'],
            });
        },
    });

    return { mutation };
};
