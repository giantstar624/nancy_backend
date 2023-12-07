import express from "express";
const router = express.Router();

import authController from "../controllers/authController.js";

/* Working with the route. */
router.post('/login', authController.onLogin);
router.post('/signup', authController.onSignup);
router.get('/verify', authController.onVerify);

router.post('/forgot-password', authController.onSendResetPasswordLink);
router.post('/reset-password', authController.onPasswordReset);

// router.get('/:id', getUsersById);
// router.delete('/:id', deleteUsers);
// router.post('/register', registerUsers);
// router.post('/login', signInUsers);
// router.put('/:id', updateUsers);



export default router;