import { deserialize, fetchWrapper, throwIfError } from '..';
import { ChatMessage } from './type';

export const getChatHistory = async (): Promise<ChatMessage[]> => {
    const response = await fetchWrapper(`/chat`);

    return await deserialize(response);
};
export const getChatHistoryKey = ['chat'];

export const chat = async (
    message: string,
    onChunk?: (text: string) => void,
) => {
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
};
