import express from "express";
const router = express.Router();

//We import the function that get called when the navigate to the following routes.
import promoController from '../controllers/promoController.js';

// const { auth } = require('../middleWare/authorization');
import { authUser } from '../middleWare/authorization.js';
      

router.get('/', promoController.getAll);
// router.post('/', authUser, postPost);
// router.put('/reply', authUser, replyPost);
// router.get('/:id', authUser, deletePost);
// router.put('/:id', authUser, updatePost);




export default router;
