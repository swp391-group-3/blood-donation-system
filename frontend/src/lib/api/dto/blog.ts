export interface Blog {
    id: string;
    owner: string;
    tags: string[];
    title: string;
    description: string;
    content: string;
    created_at: Date;
}
