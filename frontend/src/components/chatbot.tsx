'use client';

import type React from 'react';

import { useState } from 'react';
//import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Heart,
    X,
    Send,
    Minimize2,
    MessageCircle,
    MessageSquare,
    MessagesSquare,
    Bot,
    Headphones,
    HelpCircle,
    Zap,
    Sparkles,
    Brain,
    Cpu,
} from 'lucide-react';

type ChatbotIconType =
    | 'messageCircle'
    | 'messageSquare'
    | 'messagesSquare'
    | 'bot'
    | 'headphones'
    | 'helpCircle'
    | 'zap'
    | 'sparkles'
    | 'brain'
    | 'cpu';

interface BloodDonationChatbotProps {
    iconType?: ChatbotIconType;
    showIconSelector?: boolean;
}

export function BloodDonationChatbot({
    iconType = 'bot',
    showIconSelector = false,
}: BloodDonationChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIcon, setCurrentIcon] = useState<ChatbotIconType>(iconType);
    // const { messages, input, handleInputChange, handleSubmit, isLoading } =
    //     useChat({
    //         api: '/api/blood-donation-chat',
    //     });

    const iconOptions = {
        messageCircle: { icon: MessageCircle, label: 'Chat Bubble' },
        messageSquare: { icon: MessageSquare, label: 'Square Chat' },
        messagesSquare: { icon: MessagesSquare, label: 'Multiple Chats' },
        bot: { icon: Bot, label: 'AI Bot' },
        headphones: { icon: Headphones, label: 'Support' },
        helpCircle: { icon: HelpCircle, label: 'Help' },
        zap: { icon: Zap, label: 'Quick AI' },
        sparkles: { icon: Sparkles, label: 'Smart AI' },
        brain: { icon: Brain, label: 'Intelligence' },
        cpu: { icon: Cpu, label: 'AI Processor' },
    };

    const CurrentIcon = iconOptions[currentIcon].icon;

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    // const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     if (input.trim()) {
    //         handleSubmit(e);
    //     }
    // };

    return (
        <>
            {!isOpen && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Button
                        onClick={toggleChat}
                        className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 shadow-lg p-0 transition-all duration-200 hover:scale-110"
                        aria-label="Open blood donation chat assistant"
                    >
                        <CurrentIcon className="h-6 w-6 text-white" />
                    </Button>

                    {/* Icon Selector (if enabled) */}
                    {showIconSelector && (
                        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-2 grid grid-cols-2 gap-1 w-24">
                            {Object.entries(iconOptions).map(
                                ([key, { icon: Icon, label }]) => (
                                    <Button
                                        key={key}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentIcon(
                                                key as ChatbotIconType,
                                            )
                                        }
                                        className={`h-12 w-12 p-0 ${currentIcon === key ? 'bg-red-100' : ''}`}
                                        title={label}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </Button>
                                ),
                            )}
                        </div>
                    )}
                </div>
            )}

            {isOpen && (
                <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                    <CardHeader className="bg-red-600 text-white rounded-t-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CurrentIcon className="h-5 w-5" />
                                <CardTitle className="text-sm font-medium">
                                    Blood Donation Assistant
                                </CardTitle>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleChat}
                                    className="h-6 w-6 p-0 text-white hover:bg-red-700"
                                    title="Minimize"
                                >
                                    <Minimize2 className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleChat}
                                    className="h-6 w-6 p-0 text-white hover:bg-red-700"
                                    title="Close"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                        {/* {messages.length === 0 && ( */}
                        <div className="text-center text-gray-500 text-sm">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <CurrentIcon className="h-6 w-6 text-red-400" />
                                <Heart
                                    className="h-6 w-6 text-red-400"
                                    fill="currentColor"
                                />
                            </div>
                            <p className="font-medium">
                                Hi! I'm your Blood Donation AI Assistant.
                            </p>
                            <p className="text-xs mt-1 text-gray-400">
                                Ask me about eligibility, locations, donation
                                process, or any blood donation questions!
                            </p>
                            <div className="mt-3 space-y-1 text-xs">
                                <div className="bg-gray-50 rounded p-2">
                                    <p className="font-medium text-gray-600">
                                        Try asking:
                                    </p>
                                    <p>"Am I eligible to donate blood?"</p>
                                    <p>"Where can I donate near me?"</p>
                                    <p>"What should I do before donating?"</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    {/* )} */}

                    {/* {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                        message.role === 'user'
                                            ? 'bg-red-600 text-white rounded-br-none'
                                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                    }`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="flex items-center gap-1 mb-1">
                                            <CurrentIcon className="h-3 w-3 text-red-500" />
                                            <span className="text-xs text-gray-500">
                                                Assistant
                                            </span>
                                        </div>
                                    )}
                                    {message.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none text-sm">
                                    <div className="flex items-center gap-2">
                                        <CurrentIcon className="h-3 w-3 text-red-500" />
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{
                                                    animationDelay: '0.1s',
                                                }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{
                                                    animationDelay: '0.2s',
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="p-3 border-t bg-gray-50">
                        <form onSubmit={onSubmit} className="flex w-full gap-2">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Ask about blood donation..."
                                className="flex-1 text-sm bg-white"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 px-3"
                                disabled={isLoading || !input.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                        <div className="absolute bottom-1 right-3 text-xs text-gray-400">
                            Powered by AI
                        </div>
                    </CardFooter> */}
                </Card>
            )}
        </>
    );
}
