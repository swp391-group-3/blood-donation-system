import { deserialize, fetchWrapper, QueryData, throwIfError } from '..';
import { Question } from './type';

export const createQuestion = async (content: string) => {
    const response = await fetchWrapper('/question', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: content,
    });

    await throwIfError(response);
};

export const getAllQuestions = async (): Promise<Question[]> => {
    const response = await fetchWrapper('/question');

    return await deserialize(response);
};
export const getAllQuestionsKey = ['question'];

export const updateQuestion = async (id: number, content: string) => {
    const response = await fetchWrapper(`/question/${id}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: content,
    });

    await throwIfError(response);
};

export const deleteQuestion = async (id: number) => {
    const response = await fetchWrapper(`/question/${id}`, {
        method: 'DELETE',
    });

    await throwIfError(response);
};
