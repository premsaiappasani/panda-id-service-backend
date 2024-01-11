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

router.route('/register').post(signUp);

router.route('/getUser').get(userAuth, getUser);

router.route('/signIn').post(signIn);

router.route('/passwords/forgot').put(publicAuth, forgotPassword);

router.route('/passwords/reset').put(userAuth, resetPassword);

export default router
