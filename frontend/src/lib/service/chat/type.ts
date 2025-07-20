export interface ChatContent {
    text: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: ChatContent[];
}
