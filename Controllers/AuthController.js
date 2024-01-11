import UserModel from '../Models/UserModel.js';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

export const getUser = async (req, res) => {
    try {
        const emailAddress = req.query.email;

        const savedUser = await UserModel.findOne({
            email: { $regex: new RegExp(emailAddress, 'i') }
        });
        if (!savedUser) {
            return res.status(404).json({
                status: 'Failure',
                token: 'Invalid Email'
            });
        }
        res.status(200).json({
            status: 'Success',
            email: savedUser.email,
            isExpert: savedUser.isExpert,
            isAfricanOrg: savedUser.isAfricanOrg
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'Failure',
            message: 'Internal Server Error'
        });
    }
};

export const signUp = (async (req, res) => {
    try {
        const emailAddress = req.body.email;
        const rawPassword = req.body.password;
        const isExpert = req.body.isExpert || false;
        const isAfricanOrg = req.body.isAfricanOrg || false;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValidEmail = emailRegex.test(emailAddress);

        if(!isValidEmail){
            return res.status(400).json({
                status: 'Failure',
                message: 'Invalid Email'
            });
        }

        const count = await UserModel.countDocuments({ email: emailAddress });

        if(count > 0) {
            return res.status(400).json({
                status: 'Failure',
                message: 'Email Already Exists'
            });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,32}$/;
        const isValidPassword = passwordRegex.test(rawPassword);

        if(!isValidPassword){
            return res.status(400).json({
                status: 'Failure',
                message: '\
                    Invalid password format. \
                    Length of password should be minimum 8 and maximum 32. \
                    Password Should have at least one Uppercase Alphabet. \
                    Password Should have at least one Lowercase Alphabet. \
                    Password Should have at least one Special Character. \
                '
            });
        }

        const newUser = new UserModel({
            email: emailAddress,
            passwordEncrypted: CryptoJS.AES.encrypt(rawPassword, process.env.cryptoKey).toString(),
            isExpert: isExpert,
            isAfricanOrg: isAfricanOrg
        })

        const savedUser = await newUser.save();
        const jwtData = {
            "_id": savedUser._id,
            "email": savedUser.email
        }
        const expiresIn = '9h';
        const jwtToken = jwt.sign(jwtData, process.env.JWT_SECRET, { expiresIn });

        res.status(201).json({
            status: 'Success',
            token: jwtToken
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'Failure',
            message: 'Internal Server Error'
        });
    }
});

export const signIn = async (req, res) => {
    try {
        const emailAddress = req.body.email;
        const rawPassword = req.body.password;

        const savedUser = await UserModel.findOne({
            email: { $regex: new RegExp(emailAddress, 'i') }
        });

        if (savedUser) {
            const savedPassword = CryptoJS.AES.decrypt(savedUser.passwordEncrypted, process.env.cryptoKey).toString(CryptoJS.enc.Utf8);
            if (savedPassword !== rawPassword) return res.status(401).json({
                status: 'Failure',
                message: 'Incorrect Password'
            });

            const jwtData = {
                "_id": savedUser._id,
                "email": emailAddress
            }
            const expiresIn = '9h';
            const jwtToken = jwt.sign(jwtData, process.env.JWT_SECRET, { expiresIn });
            return res.status(200).json({
                status: 'Success',
                token: jwtToken
            });
        }
        else {
            res.status(404).json({
                status: 'Failure',
                token: 'Invalid Email'
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'Failure',
            message: 'Internal Server Error'
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const passPhrase = req.body.passPhrase;
        const rawPassword = req.body.password;
        const emailAddress = req.body.email;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,32}$/;
        const isValidPassword = passwordRegex.test(rawPassword);

        if(!isValidPassword){
            return res.status(400).json({
                status: 'Failure',
                message: '\
                    Invalid password format. \
                    Length of password should be minimum 8 and maximum 32. \
                    Password Should have at least one Uppercase Alphabet. \
                    Password Should have at least one Lowercase Alphabet. \
                    Password Should have at least one Special Character. \
                '
            });
        }

        const savedUser = await UserModel.findOne({
            email: { $regex: new RegExp(emailAddress, 'i') }
        });

        if (!savedUser) {
            return res.status(404).json({
                status: 'Failure',
                token: 'Invalid Email'
            });
        }

        const decryptedPassPhrase = CryptoJS.AES.decrypt(passPhrase, process.env.cryptoKey).toString(CryptoJS.enc.Utf8);

        if(decryptedPassPhrase !== savedUser.passwordEncrypted){
            return res.status(401).json({
                status: 'Failure',
                token: 'Invalid PassPhrase'
            });
        }

        savedUser.passwordEncrypted = CryptoJS.AES.encrypt(rawPassword, process.env.cryptoKey).toString();
        await savedUser.save();
        res.status(201).json({
            status: 'Success',
            message: 'Password Updated'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'Failure',
            message: 'Internal Server Error'
        });
    }
}


export const forgotPassword = async (req, res) => {
    try {
        const emailAddress = req.body.email;
        const baseUrl = req.originalUrl;

        const savedUser = await UserModel.findOne({
            email: { $regex: new RegExp(emailAddress, 'i') }
        });

        if(!savedUser){
            return res.status(404).json({
                status: 'Failure',
                message: 'Invalid Email'
            });
        }

        const passPhrase = CryptoJS.AES.encrypt(savedUser.passwordEncrypted, process.env.cryptoKey);
        const queryUrl = `${process.env.prodUrl}/user/passwords/reset/?passPhrase=${passPhrase}`;

        res.status(200).json({
            status: 'Success',
            resetUrl: queryUrl,
            passPhrase: passPhrase
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'Failure',
            message: 'Internal Server Error'
        });
    }
}
