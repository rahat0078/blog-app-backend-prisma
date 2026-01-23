import { CommentStatus } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

type CommentCreation = {
    content: string;
    authorId: string;
    postId: string;
    parentId?: string | null;
    status: CommentStatus;
}


const createComment = async (payload: CommentCreation) => {
    await prisma.posts.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    });

    if (payload.parentId) {
        await prisma.comments.findUniqueOrThrow({
            where: {
                id: payload.parentId
            }
        });
    }

    const result = await prisma.comments.create({
        data: payload
    });
    return result;
}

const getCommentById = async (commentId: string) => {
    const getComment = await prisma.comments.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    })

    return getComment
}


const getCommentByAuthorId = async (authorId: string) => {
    return await prisma.comments.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
}

const deleteComment = async (commentId: string, authorId: string) => {
    const commentData = await prisma.comments.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    });
    if (!commentData) {
        throw new Error('Your provided input is invalid')
    }

    return await prisma.comments.delete({
        where: {
            id: commentData.id
        }
    })
}



const updateComment = async (commentId: string, data: { content?: string, status?: CommentStatus }, authorId: string) => {
    const commentData = await prisma.comments.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })
    if (!commentData) {
        throw new Error('Your provided input is invalid')
    }

    return await prisma.comments.update({
        where: {
            id: commentId,
            authorId
        },
        data        // this is update value. content and status these two are optional
    })
}


const moderateComment = async (commentId: string, data: {status: CommentStatus}) => {
    const commentData = await prisma.comments.findUniqueOrThrow({
        where: {
            id: commentId,
        },
        select: {
            status: true,
            id: true
        }
    });

    if(commentData.status === data.status){
        throw new Error(`Your Provided status ${data.status} is already up to date.`) 
    }


    return await prisma.comments.update({
        where: {
            id: commentId
        },
        data: {
            status: data.status
        }
    })
}


export const commentService = {
    createComment, getCommentById, getCommentByAuthorId, deleteComment, updateComment, moderateComment
}