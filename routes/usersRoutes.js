import express from "express";
const router = express.Router();

import { authUser } from '../middleWare/authorization.js';

import { 
    getUsers, 
    registerUsers, 
    deleteUsers, 
    updateUsers, 
    getUsersById, 
    signInUsers,
    changeAvatar,
    changeUsername,
} from '../controllers/userActions.js';


/* Working with the route. */
router.get('/', getUsers);
router.get('/:id', getUsersById);
router.delete('/:id', deleteUsers);
router.post('/register', registerUsers);
router.post('/login', signInUsers);
router.put('/:id', updateUsers);

router.post('/avatar', authUser, changeAvatar);
router.post('/username', authUser, changeUsername);


export default router;
