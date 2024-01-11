import express from 'express';
import userAuth from '../Middlewares/UserAuth.js';
import publicAuth from '../Middlewares/PublicAuth.js';
import {
    getUser,
    signUp,
    signIn,
    resetPassword,
    forgotPassword
} from '../Controllers/AuthController.js';

const router = express.Router();

router.route('/register').post(publicAuth, signUp);

router.route('/getUser').get(userAuth, getUser);

router.route('/signIn').post(publicAuth, signIn);

router.route('/passwords/forgot').put(publicAuth, forgotPassword);

router.route('/passwords/reset').put(publicAuth, resetPassword);

export default router
