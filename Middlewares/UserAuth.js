import User from '../Models/UserModel.js';
import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    try {
        console.log("cookie check", req.headers.authorization);
        if (!req.headers.authorization) return res.status(401).send('You are not logged in') && console.log('no cookie');
        let token = req.headers.authorization;
        if (token.startsWith("Bearer ")){
            token = token.substring(7, token.length);
        }
        if (token == 'undefined') return res.status(401).send('You are not logged in.');
        let data = null;
        try {
            data = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.log(err);
            return res.status(401).json('Invalid Token');
        }
        const userProps = User.findById(data._id);
        if (!userProps) return res.status(401).send("Unauthorised");
        req.user = data;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).json('Internal Server Error');
    }
}

export default userAuth;