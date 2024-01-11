import express from 'express';
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./Routes/AuthRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json({ extended: true, limit: "16mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use(cors({
    origin: "*",
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("App is up and running");
});

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
