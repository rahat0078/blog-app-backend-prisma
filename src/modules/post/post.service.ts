import { Posts, PostStatus, Prisma } from "../../../generated/prisma"
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

const getAllPosts = async ({ search, tags, isFeatured, status, authorId }:
    {
        search: string | undefined,
        tags: string[] | [],
        isFeatured: boolean | undefined,
        status: PostStatus | undefined, 
        authorId: string | undefined,
    }) => {
    const andCondition: Prisma.PostsWhereInput[] = [];

    if (search) {
        andCondition.push(
            {
                OR: [
                    {
                        title: {
                            contains: search as string,
                            mode: "insensitive"
                        }
                    },
                    {
                        content: {
                            contains: search as string,
                            mode: "insensitive"
                        }
                    },
                    {
                        tags: {
                            has: search as string
                        }
                    }
                ]
            }
        )
    }
    if (tags.length > 0) {
        andCondition.push(
            {
                tags: {
                    hasEvery: tags as string[]
                }
            }
        )
    }

    if (typeof isFeatured === 'boolean') {
        andCondition.push({
            isFeatured
        })
    }

    if(status){
        andCondition.push({status})
    }
    if(authorId){
        andCondition.push({authorId})
    }


    const result = await prisma.posts.findMany({
        where: {
            AND: andCondition
        }
    })
    return result
}

export const postService = {
    createPost, getAllPosts
}
