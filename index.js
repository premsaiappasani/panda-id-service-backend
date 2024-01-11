import express from 'express';
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./Routes/AuthRoutes.js";
import dotenv from "dotenv";
// import jwt from 'jsonwebtoken';
// import nacl from 'tweetnacl'
// import bs58 from 'bs58'

dotenv.config();


const app = express();

app.use(express.json({ extended: true, limit: "16mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use(cors({
    origin: ["http://localhost:3000", "https://www.panda-staging.com"],
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("App is up and running");
});

// app.post("/", (req, res) => {
//     const message = req.body.message;
//     const signature = req.body.signature;
//     const public_key = req.body.public_key;
//     console.log(message, signature, public_key);
//     const verified = nacl
//         .sign
//         .detached
//         .verify(
//             new TextEncoder().encode(message),
//             bs58.decode(signature),
//             bs58.decode(public_key)
//         )
//     res.send(verified);
// });

// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Request-Headers", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });

// app.use(function (req, res, next) {
//     let token = req.headers["token"];
//     token = token && token.replace("Bearer ", "");
//     if (!token) {
//         return next();
//     }
//     console.log("verifying token");
//     jwt.verify(token, "fa4d4hqby83", function (err, user) {
//         if (err) {
//             console.log(err);
//             return res.status(401).json({
//                 success: false,
//                 message: "Session expired!",
//             });
//         } else {
//             console.log(user);
//             req.user = user;
//             next();
//         }
//     });
// });

mongoose.connect(
    process.env.MongoURI
)
.then(() => {
    app.listen(process.env.API_PORT, () => {
        console.log(`Listening on port ${process.env.API_PORT}`);
    });
})
.catch((err) => console.log(err));

app.use("/user", authRouter);
