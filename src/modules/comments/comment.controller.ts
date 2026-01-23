import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    try {
        const user = req?.user;
        req.body.authorId = user?.id;
        const result = await commentService.createComment(req.body);
        res.status(201).json({
            success: true,
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            error: "Comment creation Failed",
            details: error
        })
    }
}

const getCommentById = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const result = await commentService.getCommentById(commentId as string);
        res.status(200).json({
            success: true,
            message: "Comment fetched successfully",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            error: "Comment fetched failed",
            details: error
        })
    }
};


const getCommentByAuthor = async (req: Request, res: Response) => {
    try {
        const { authorId } = req.params;
        const result = await commentService.getCommentByAuthorId(authorId as string);
        if (result.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "No Data Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Comment fetched successfully",
            data: result
        })
    } catch (err: any) {
        res.status(400).json({
            error: "Comment fetched failed",
            details: err.message
        })
    }
}


const deleteComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const user = req.user;
        if (!user?.id) {
            return res.status(401).json({
                error: "Unauthorized user"
            });
        }

        const result = await commentService.deleteComment(commentId as string, user?.id as string);
        res.status(200).json({
            success: true,
            message: "Comment Deleted Successfully..!",
            data: result
        })
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            error: "Comment Delete Failed",
            details: error.message
        })
    }
}

const updateComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const user = req.user;
        if (!user?.id) {
            return res.status(401).json({
                error: "Unauthorized user"
            });
        }
        const data = req.body

        const result = await commentService.updateComment(commentId as string, data, user?.id as string);
        res.status(200).json({
            success: true,
            message: "Comment Updated Successfully..!",
            data: result
        })
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            error: "Comment Update Failed",
            details: error.message
        })
    }
}

const moderateComment = async (req: Request, res: Response) => {
    try {
        const {commentId} = req.params
        const result = await commentService.moderateComment(commentId as string, req?.body);
        res.status(200).json({
            success: true,
            message: "Comment Moderate Successfully",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            error: error.message || "Comment Update Failed",
            details: error.message
        })
    }
}


export const commentController = {
    createComment, getCommentById, getCommentByAuthor, deleteComment, updateComment, moderateComment
}