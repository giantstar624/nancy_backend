import express from "express";
const router = express.Router();

//We import the function that get called when the navigate to the following routes.
import { getPost, updatePost, postPost, deletePost, replyPost } from "../controllers/postAction.js";

import { authSupport, authUser } from '../middleWare/authorization.js';
      

router.get('/', getPost);
router.post('/', authUser, postPost);
router.put('/reply', authUser, replyPost);
router.get('/:id', authUser, deletePost);
router.put('/:id', authUser, updatePost);

export default router;
