import { NextFunction, Request, Response } from "express"
import { postService } from "./post.service";
import { paginationSortingHelper } from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../enums/user_role";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
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
        next(error)
    }
}

const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
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

        const status = req.query.status as PostStatus | undefined;
        const authorId = req.query.authorId as string | undefined;


        const options = paginationSortingHelper(req.query)
        const { page, limit, skip, sortBy, sortOrder } = options



        const result = await postService.getAllPosts({ search: searchStr, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder });
        res.status(200).json({
            success: true,
            message: "Post retrieved successfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;

        const result = await postService.getPostById(postId as string);
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}


const getPostByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req?.user;
        if (!user) {
            throw new Error("You are unauthorized")
        }

        const result = await postService.getPostByUser(user.id);
        res.status(200).json({
            success: true,
            message: "Post retrive successfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
}


const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req?.user;
        if (!user) {
            throw new Error("You are unauthorized")
        }
        const { postId } = req.params;
        const isAdmin = user.role === UserRole.ADMIN

        const result = await postService.updatePost(postId as string, req.body, user.id, isAdmin);
        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req?.user;
        if (!user) {
            throw new Error("You are unauthorized")
        }
        const { postId } = req.params;
        const isAdmin = user.role === UserRole.ADMIN

        const result = await postService.deletePost(postId as string, user.id, isAdmin);
        res.status(200).json({
            success: true,
            message: "Post delete successfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
}


const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await postService.getStats();
        res.status(200).json({
            success: true,
            message: "stat fetched successfully",
            data: result
        })
    } catch (error) {
        next(error)
    }
}




export const postController = {
    createPost, getAllPosts, getPostById, getPostByUser, updatePost, deletePost, getStats
}