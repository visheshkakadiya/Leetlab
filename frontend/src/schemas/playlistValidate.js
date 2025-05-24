import z from 'zod';

export const playlistSchema = z.object({
    name: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
});