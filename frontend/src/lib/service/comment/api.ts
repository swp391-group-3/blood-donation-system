import { deserialize, fetchWrapper, throwIfError } from '..';

export const createComment = async (blogId: string, content: string) => {
    const response = await fetchWrapper(`/blog/${blogId}/comment`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: content,
    });

    await throwIfError(response);
};

export const getComments = async (blogId: string): Promise<Comment[]> => {
    const response = await fetchWrapper(`/blog/${blogId}/comment`);

    return await deserialize(response);
};
export const getCommentsKey = (blogId: string) => ['blog', blogId, 'comment'];

export const updateComment = async (id: string, content: string) => {
    const response = await fetchWrapper(`/comment/${id}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: content,
    });

    await throwIfError(response);
};

export const deleteComment = async (id: string) => {
    const response = await fetchWrapper(`/comment/${id}`, { method: 'DELETE' });

    await throwIfError(response);
};
