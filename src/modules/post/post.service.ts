import { CommentStatus, Posts, PostStatus, Prisma } from "../../../generated/prisma/client";
import { UserRole } from "../../enums/user_role";
import { prisma } from "../../lib/prisma";


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


    const allPosts = await prisma.posts.findMany({
        take: limit,
        skip,
        where: {
            AND: andCondition
        },
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            _count: {
                select: { comments: true }
            }
        }
    })
    const totalData = await prisma.posts.count({
        where: {
            AND: andCondition
        }
    });

    return {
        data: allPosts, pagination: {
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
                id: postId,
            },
            include: {
                comments: {
                    where: {
                        parentId: null,
                        status: CommentStatus.APPROVED
                    },
                    orderBy: { createdAt: 'desc' },
                    include: {
                        replies: {
                            where: {
                                status: CommentStatus.APPROVED
                            },
                            orderBy: { createdAt: "asc" },
                            include: {
                                replies: {
                                    where: {
                                        status: CommentStatus.APPROVED
                                    },
                                    orderBy: { createdAt: "asc" },
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: { comments: true }
                }
            }
        })
        return postData
    })
}

const getPostByUser = async (authorId: string) => {

    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            id: authorId,
            status: 'active'
        },
        select: {
            id: true
        }
    })
    return await prisma.posts.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    });
}


const updatePost = async (postId: string, data: Partial<Posts>, authorId: string, isAdmin: boolean) => {
    const postData = await prisma.posts.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    });

    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error('Your are not author of this post');
    };

    if (!isAdmin) {
        delete data.isFeatured
    };

    return await prisma.posts.update({
        where: {
            id: postData.id
        },
        data
    });

};

const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
    const postData = await prisma.posts.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    });
    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error('Your are not author of this post');
    };

    return await prisma.posts.delete({
        where: {
            id: postData.id
        }
    });

}


const getStats = async () => {
    return await prisma.$transaction(async (tx) => {
        const [totalPosts, publishedPosts, draftPosts, archivedPosts, totalComments, approvedComments, rejectedComments, totalUsers, adminCount, userCount, totalViews] = await Promise.all([
            await tx.posts.count(),
            await tx.posts.count({ where: { status: PostStatus.PUBLISHED } }),
            await tx.posts.count({ where: { status: PostStatus.DRAFT } }),
            await tx.posts.count({ where: { status: PostStatus.ARCHIVED } }),
            await tx.comments.count(),
            await tx.comments.count({ where: { status: CommentStatus.APPROVED } }),
            await tx.comments.count({ where: { status: CommentStatus.REJECTED } }),
            await tx.user.count(),
            await tx.user.count({ where: { role: UserRole.ADMIN } }),
            await tx.user.count({ where: { role: UserRole.USER } }),
            await tx.posts.aggregate({_sum: {views: true}})
            

        ])

        return {
            totalPosts, publishedPosts, draftPosts, archivedPosts, totalComments, approvedComments, rejectedComments, totalUsers, adminCount, userCount, totalViews: totalViews._sum.views
        }

    })
}

export const postService = {
    createPost, getAllPosts, getPostById, getPostByUser, updatePost, deletePost, getStats
}
