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

const getAllPosts = async ({ search, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder }:
    {
        search: string | undefined,
        tags: string[] | [],
        isFeatured: boolean | undefined,
        status: PostStatus | undefined,
        authorId: string | undefined,
        page: number,
        limit: number,
        skip: number,
        sortBy: string,
        sortOrder: string,
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

    if (status) {
        andCondition.push({ status })
    }
    if (authorId) {
        andCondition.push({ authorId })
    }


    const result = await prisma.posts.findMany({
        take: limit,
        skip,
        where: {
            AND: andCondition
        },
        orderBy: {
            [sortBy]: sortOrder
        }
    })
    const totalData = await prisma.posts.count({
        where: {
            AND: andCondition
        }
    });

    return {
        data: result, pagination: {
            total: totalData, page, limit, totalPage: Math.ceil(totalData / limit)
        }
    }
}

const getPostById = async (postId: string) => {

    return await prisma.$transaction(async (tx) => {
        await tx.posts.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })
        const postData = await tx.posts.findUnique({
            where: {
                id: postId
            }
        })
        return postData
    })
}

export const postService = {
    createPost, getAllPosts, getPostById
}
