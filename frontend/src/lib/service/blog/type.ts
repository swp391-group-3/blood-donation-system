import { z } from 'zod';

export interface BlogFilter {
    query: string;
}

export interface Blog {
    id: string;
    owner: string;
    tags: string[];
    title: string;
    description: string;
    content: string;
    created_at: Date;
}

export const createBlogSchema = z.object({
    title: z.string().min(1, 'Must inclucde blog title'),
    description: z.string().min(1, 'Must include blog description'),
    tags: z.array(z.string()),
    content: z.string().min(1, 'Must include blog content'),
});

export const updateBlogSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    content: z.string().optional(),
});
