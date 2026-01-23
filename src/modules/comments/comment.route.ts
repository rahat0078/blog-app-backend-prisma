import express from 'express';
import { commentController } from './comment.controller';
import auth from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user_role';


const router = express.Router();

router.get("/author/:authorId", commentController.getCommentByAuthor)
router.get("/:commentId", commentController.getCommentById)
router.post("/", auth(UserRole.USER, UserRole.ADMIN), commentController.createComment)
router.delete("/:commentId", auth(UserRole.USER, UserRole.ADMIN), commentController.deleteComment)


export const commentRouter = router