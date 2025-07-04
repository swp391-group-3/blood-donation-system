import { useState } from 'react';
import { usePostChat } from './use-post-chat';
import type { ChatMessage } from '@/lib/api/dto/chat';

export const useChatHandler = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    const { mutation } = usePostChat();
    const { mutate: sendMessage } = mutation;

    const handleSendMessage = (input: string) => {
        const trimmed = input.trim();
        if (!trimmed) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: [{ type: 'text', text: trimmed }],
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        let currentText = '';

        const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: [{ type: 'text', text: '' }],
        };
        setMessages((prev) => [...prev, assistantMessage]);

        sendMessage(
            {
                message: trimmed,
                onChunk: (partialText: string) => {
                    currentText = partialText;
                    setMessages((prev) => {
                        const updated = [...prev];
                        const last = updated[updated.length - 1];
                        if (last.role === 'assistant') {
                            last.content[0].text = currentText;
                        }
                        return updated;
                    });
                },
            },
            {
                onSuccess: () => setIsTyping(false),
                onError: () => {
                    setIsTyping(false);
                    setMessages((prev) => [
                        ...prev.slice(0, -1),
                        {
                            role: 'assistant',
                            content: [
                                {
                                    type: 'text',
                                    text: 'Something went wrong. Please try again.',
                                },
                            ],
                        },
                    ]);
                },
            },
        );
    };

    return {
        messages,
        setMessages,
        isTyping,
        setIsTyping,
        handleSendMessage,
    };
};
