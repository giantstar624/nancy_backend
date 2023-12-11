import express from "express";
const router = express.Router();

import AdminController from '../controllers/adminController.js';
import { authSupport, authUser, authAdmin } from '../middleWare/authorization.js';

router.get('/user', authSupport, AdminController.getCustomers);
router.post('/user/block', authSupport, AdminController.blockUser);
router.post('/user/active', authSupport, AdminController.activeUser);
router.post('/user/delete', authSupport, AdminController.deleteUser);

router.post('/support/block', authAdmin, AdminController.blockUser);
router.post('/support/active', authAdmin, AdminController.activeUser);
router.get('/support', authAdmin, AdminController.getSupports);
router.delete('/support', authAdmin, AdminController.deleteSupports);
router.post('/support/register', authAdmin, AdminController.registerSupports);


router.post('/chat', authSupport, AdminController.addChat);

router.get('/post', authUser, AdminController.getPosts);
router.put('/post', authUser, AdminController.updateStatus);
router.delete('/post', authSupport, AdminController.deletePost);

router.get('/review', authUser, AdminController.getReviews);
router.put('/review', authUser, AdminController.updateReviewStatus);
router.put('/review/reply', authUser, AdminController.onReply);
router.delete('/review', authSupport, AdminController.deleteReview);

router.get('/promo', authUser, AdminController.getPromos);
router.put('/promo', authSupport, AdminController.actionPromo);
router.post('/promo', authSupport, AdminController.createPromo);
router.post('/promo/tag', authSupport, AdminController.setPromoTag);
router.delete('/promo', authSupport, AdminController.deletePromo);

router.get('/banner', AdminController.getBanners);
router.put('/banner', authAdmin, AdminController.updateBanner);
router.post('/banner', authAdmin, AdminController.createBanner);
router.delete('/banner', authAdmin, AdminController.deleteBanner);


router.get('/maq', AdminController.getMaq);
router.post('/maq', authAdmin, AdminController.changeMaqText);


export default router;