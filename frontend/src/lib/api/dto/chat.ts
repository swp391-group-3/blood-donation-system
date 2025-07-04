export interface ChatContent {
    type?: 'text';
    text: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: ChatContent[];
}

export type ChatHistoryResponse = ChatMessage[];
