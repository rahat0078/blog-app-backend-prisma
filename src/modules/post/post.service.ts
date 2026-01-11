import { Posts } from "../../../generated/prisma"
import { prisma } from "../../lib/prisma"

type CreatePostInput = Omit<
    Posts,
    'id' | 'updatedAt' | 'authorId' | 'createdAt' | 'views'
>

const createPost = async (data: CreatePostInput, userId: string) => {
    return prisma.posts.create({
        data: {
            ...data,
            authorId: userId,
        },
    })
}

export const postService = {
    createPost,
}
