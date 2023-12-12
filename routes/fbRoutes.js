import express from "express";
const router = express.Router();
import { authSupport } from '../middleWare/authorization.js';
import { postWebHook, getWebHook } from "../controllers/fbController.js";


/* Working with the route. */
router.post('/', postWebHook);
router.get('/', getWebHook);

export default router;
