import { z } from 'zod';
import { buildParams, deserialize, fetchWrapper, throwIfError } from '..';
import { Blog, BlogFilter, createBlogSchema, updateBlogSchema } from './type';

export const createBlog = async (values: z.infer<typeof createBlogSchema>) => {
    const response = await fetchWrapper('/blog', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};

export const getAllBlogs = async (filter: BlogFilter): Promise<Blog[]> => {
    const params = buildParams(filter).toString();

    const response = await fetchWrapper(`/blog?${params}`);

    return await deserialize(response);
};
export const getAllBlogsKey = (filter: BlogFilter) => ['blog', filter];

export const getBlog = async (id: string): Promise<Blog> => {
    const response = await fetchWrapper(`/blog/${id}`);

    return await deserialize(response);
};
export const getBlogKey = (id: string) => ['blog', id];

export const updateBlog = async (
    id: string,
    values: z.infer<typeof updateBlogSchema>,
) => {
    const response = await fetchWrapper(`/blog/${id}`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    await throwIfError(response);
};

export const deleteBlog = async (id: string) => {
    const response = await fetchWrapper(`/blog/${id}`, {
        method: 'DELETE',
    });

    await throwIfError(response);
};
