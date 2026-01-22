import express from 'express';
import { commentController } from './comment.controller';
import auth from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user_role';


const router = express.Router();


router.post("/", auth(UserRole.USER, UserRole.ADMIN), commentController.createComment)



export const commentRouter = router