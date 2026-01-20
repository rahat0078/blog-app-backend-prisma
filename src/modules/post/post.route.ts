import express from 'express';
import { postController } from './post.controller';
import auth  from '../../middlewares/auth.middleware';
import { UserRole } from '../../enums/user_role';
const router = express.Router();

router.get('/', postController.getAllPosts)
router.post('/', auth(UserRole.USER, UserRole.ADMIN), postController.createPost)
router.get('/:postId', postController.getPostById)



export const postRouter = router;