import User from '../Models/UserModel.js';
import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    try {
        console.log("cookie check", req.headers.authorization);
        if(req.headers.authorization !== process.env.adminKey) return res.status(401).json('Not an Admin');
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).json('Token Expired');
    }
}

export default userAuth;
