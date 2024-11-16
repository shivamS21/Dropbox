import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "../config/mongodbConnect.js";
import fileRouter from "../routes/fileRoutes.js";
dotenv.config();

const startServer = async () => {
    try {
        await connectDb();

        const app = express();
        app.use(cors({ origin: "http://localhost:3000" }));
        app.use(express.json());

        app.use("/api/files", fileRouter);  // single end-point handing files operation

        const port = process.env.PORT || 5000;
        app.listen(port, ()=>{
            console.log(`Server running at port:${port}`);
        })
    } catch(e) {
        console.error(e);
    }
}
startServer();