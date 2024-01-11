import User from '../Models/UserModel.js';
import jwt from 'jsonwebtoken';

const publicAuth = async (req, res, next) => {
    try {
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).json('Internal Server Error');
    }
}

export default publicAuth;