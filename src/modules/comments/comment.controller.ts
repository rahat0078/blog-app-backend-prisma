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
        if(result.length <= 0){
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
    } catch (error) {
        res.status(400).json({
            error: "Comment fetched failed",
            details: error
        })
    }
}


export const commentController = {
    createComment, getCommentById, getCommentByAuthor
}