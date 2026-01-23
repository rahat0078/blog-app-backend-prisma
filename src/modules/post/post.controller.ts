import { Request, Response } from "express"
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma";
import { paginationSortingHelper } from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../enums/user_role";

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
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const getPostById = async (req: Request, res: Response) => {
    try {
        const {postId} = req.params;
        
        const result = await postService.getPostById(postId as string);
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const getPostByUser = async (req: Request, res: Response) => {
    try {
        const user = req?.user;
        if(!user) {
            throw new Error("You are unauthorized")
        }
        
        const result = await postService.getPostByUser(user.id);
        res.status(200).json({
            success: true,
            message: "Post retrive successfully",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            error: "post fetched failed",
            success: false,
            message: error.message
        })
    }
}


const updatePost = async (req: Request, res: Response) => {
    try {
        const user = req?.user;
        if(!user) {
            throw new Error("You are unauthorized")
        }
        const {postId} = req.params;
        const isAdmin = user.role === UserRole.ADMIN
        
        const result = await postService.updatePost(postId as string, req.body, user.id, isAdmin);
        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            error: "post update failed",
            success: false,
            message: error.message
        })
    }
}

const deletePost = async (req: Request, res: Response) => {
    try {
        const user = req?.user;
        if(!user) {
            throw new Error("You are unauthorized")
        }
        const {postId} = req.params;
        const isAdmin = user.role === UserRole.ADMIN
        
        const result = await postService.deletePost(postId as string, user.id, isAdmin);
        res.status(200).json({
            success: true,
            message: "Post delete successfully",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            error: "post delete failed",
            success: false,
            message: error.message
        })
    }
}


export const postController = {
    createPost, getAllPosts, getPostById, getPostByUser, updatePost, deletePost
}