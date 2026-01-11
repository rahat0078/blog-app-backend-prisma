import { Request, Response } from "express"
import { postService } from "./post.service";

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




export const postController = {
    createPost
}