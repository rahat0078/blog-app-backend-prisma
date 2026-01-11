import express from 'express';
import { postController } from './post.controller';
import auth  from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user_role';
const router = express.Router();


router.post('/', auth(UserRole.USER, UserRole.ADMIN), postController.createPost)



export const postRouter = router;