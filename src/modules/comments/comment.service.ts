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



export const commentService = {
    createComment
}