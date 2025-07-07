'use client';
import { fetchWrapper, throwIfError } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ChatMessage } from '@/lib/api/dto/chat';

type PostChatArgs = {
    message: string;
    onChunk?: (text: string) => void;
};

export const usePostChat = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ChatMessage, Error, PostChatArgs>({
        mutationFn: async ({ message, onChunk }) => {
            const response = await fetchWrapper('/chat', {
                method: 'POST',
                headers: {
                    Accept: 'text/plain',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: message }),
            });

            await throwIfError(response);

            if (!response.body) {
                throw new Error('No response body');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            let fullText = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                fullText += chunk;
                onChunk?.(fullText);
            }

            return {
                role: 'assistant',
                content: [{ type: 'text', text: fullText }],
            };
        },
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat'] });
        },
    });

    return { mutation };
};
