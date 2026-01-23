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


export const commentService = {
    createComment, getCommentById, getCommentByAuthorId
}