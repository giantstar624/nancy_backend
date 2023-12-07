import express from "express";
const router = express.Router();
import { authUser, authSupport } from '../middleWare/authorization.js';

import chatController from '../controllers/chatController.js';

/* Working with the route. */
router.post('/', authUser, chatController.getHistory);
router.delete('/', authSupport, chatController.deleteChat);
router.get('/users', authSupport, chatController.getUsers);
router.post('/image', authUser, chatController.sendImage);

export default router;
