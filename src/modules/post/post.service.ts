import { Prisma } from "../../../generated/prisma"
import { prisma } from "../../lib/prisma"

const createPost = async (data: Prisma.PostsCreateInput) => {
    const result = await prisma.posts.create({
        data
    })
    return result
}

export const postService = {
    createPost
}