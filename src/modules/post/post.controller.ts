import { Request, Response } from "express"
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma";

const createPost = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized"
            })
        }
        const result = await postService.createPost(req.body, req.user?.id as string)
        res.status(201).send({
            success: true,
            message: "post created successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const getAllPosts = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        const searchStr = typeof search === "string" ? search : undefined;
        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];


        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === 'true'
                ? true
                : req.query.isFeatured === 'false'
                    ? false
                    : undefined
            : undefined;

        const status = req.query.status as PostStatus | undefined
        const authorId = req.query.authorId as string | undefined


        const result = await postService.getAllPosts({ search: searchStr, tags, isFeatured, status, authorId });
        res.status(200).json({
            success: true,
            message: "Post retrieved successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}




export const postController = {
    createPost, getAllPosts
}