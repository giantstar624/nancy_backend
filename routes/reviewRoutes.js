import express from "express";
const router = express.Router();
import { authUser } from '../middleWare/authorization.js';

import reviewController from '../controllers/reviewController.js';

/* Working with the route. */
router.post('/', authUser, reviewController.create);

router.get('/', reviewController.getAll);
// router.delete('/:id', deleteUsers);
// router.post('/register', registerUsers);
// router.post('/login', signInUsers);
// router.put('/:id', updateUsers);




export default router;
