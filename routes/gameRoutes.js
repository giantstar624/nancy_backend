import express from "express";
const router = express.Router();

import { authSupport, authUser, authAdmin } from '../middleWare/authorization.js';

import { 
    getGames,
    updateIcon,
    updateUrl,
    postGame,
    deleteGame
} from "../controllers/gameAction.js";

router.get('/', getGames);
router.put('/icon', authAdmin, updateIcon);
router.put('/url', authAdmin, updateUrl);
router.post('/', authAdmin, postGame);
router.delete('/', authAdmin, deleteGame);

export default router;