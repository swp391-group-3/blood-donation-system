'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Bot, Minimize2, X, Send, Maximize2 } from 'lucide-react';
import { useGetChatHistory } from '@/hooks/use-get-chat-history';
import { usePostChat } from '@/hooks/use-post-chat';
import type { ChatMessage } from '@/lib/api/dto/chat';
import Markdown from 'react-markdown';

export function BloodDonationChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const { data: chatHistory = [], isLoading: loadingChat } =
        useGetChatHistory();

    const { mutation } = usePostChat();
    const { mutate: sendMessage, isPending: sending } = mutation;

    useEffect(() => {
        if (chatHistory.length > 0) {
            setMessages(chatHistory);
        }
    }, [chatHistory]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: [{ type: 'text', text: trimmed }],
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
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

    return (
        <>
            {!isOpen && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Button
                        onClick={toggleChat}
                        className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 shadow-lg p-0"
                        aria-label="Open chatbot"
                    >
                        <Bot className="h-6 w-6 text-white" />
                    </Button>
                </div>
            )}

            {isOpen && (
                <Card
                    className={`fixed bottom-6 right-6 shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-4 duration-300
                        ${isExpanded ? 'w-[90vw] h-[80vh]' : 'w-80 h-96'}
                    `}
                >
                    <CardHeader className="bg-red-600 text-white rounded-t-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bot className="h-5 w-5" />
                                <CardTitle className="text-sm font-medium">
                                    Blood Donation Assistant
                                </CardTitle>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="h-6 w-6 p-0 text-white hover:bg-red-700"
                                    aria-label="Toggle expand"
                                >
                                    {isExpanded ? (
                                        <Minimize2 className="h-3 w-3" />
                                    ) : (
                                        <Maximize2 className="h-3 w-3" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleChat}
                                    className="h-6 w-6 p-0 text-white hover:bg-red-700"
                                    aria-label="Close chatbot"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.length === 0 && !loadingChat && (
                            <div className="text-center text-gray-500 text-sm">
                                <p>Hi! Ask me anything about blood donation.</p>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] p-2 rounded-lg text-sm whitespace-pre-wrap ${
                                        message.role === 'user'
                                            ? 'bg-red-600 text-white rounded-br-none'
                                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                    }`}
                                >
                                    {message.content.map((c, i) =>
                                        message.role === 'assistant' ? (
                                            <Markdown key={i}>
                                                {c.text}
                                            </Markdown>
                                        ) : (
                                            <p key={i}>{c.text}</p>
                                        ),
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="max-w-[75%] p-2 rounded-lg text-sm bg-gray-100 text-gray-500 italic animate-pulse rounded-bl-none">
                                    Blood Donation Assistant is typing...
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </CardContent>

                    <CardFooter className="p-3 border-t bg-gray-50">
                        <form
                            onSubmit={handleSubmit}
                            className="flex w-full gap-2"
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about blood donation..."
                                className="flex-1 text-sm bg-white"
                                disabled={sending}
                            />
                            <Button
                                type="submit"
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 px-3"
                                disabled={sending || !input.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </>
    );
}
