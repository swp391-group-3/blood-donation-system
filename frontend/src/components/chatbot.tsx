'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Bot, Minimize2, X, Send, Maximize2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { Textarea } from '@/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { getChatHistory, getChatHistoryKey } from '@/lib/service/chat';

export function BloodDonationChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const { data: chatHistory = [], isLoading: loadingChat } = useQuery({
        queryFn: getChatHistory,
        queryKey: getChatHistoryKey,
    });

    const { messages, setMessages, isTyping, handleSendMessage } =
        useChatHandler();

    useEffect(() => {
        if (chatHistory.length > 0) {
            setMessages(chatHistory);
        }
    }, [chatHistory, setMessages]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSendMessage(input);
        setInput('');
    };

    return (
        <>
            {!isOpen && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Button
                        onClick={toggleChat}
                        className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 shadow-lg p-0"
                    >
                        <Bot className="h-10 w-10 text-white" />
                    </Button>
                </div>
            )}

            {isOpen && (
                <Card
                    className={`fixed bottom-6 right-6 z-50 flex flex-col animate-in slide-in-from-bottom-4 duration-300 overflow-hidden
                    ${isExpanded ? 'w-[90vw] h-[80vh]' : 'w-96 h-128'}
                    rounded-xl shadow-md bg-white py-0
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
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about blood donation..."
                                className="flex-1 text-sm bg-white"
                                disabled={isTyping}
                            />
                            <Button
                                type="submit"
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 px-3"
                                disabled={isTyping || !input.trim()}
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
