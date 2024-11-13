import express from "express";
import dotenv from "dotenv";
import { connectDb } from "../config/mongodbConnect.js";
import fileRouter from "../routes/fileRoutes.js";
dotenv.config();

// error handlers


async function startServer() {
    try {
        await connectDb();

        const app = express();
        app.use(express.json());

        app.use("/api/files", fileRouter);

        // app.use(errorHandler);
        const port = process.env.PORT || 5000;
        app.listen(port, ()=>{
            console.log(`Server running at port:${port}.`);
        })
    } catch(e) {
        console.error(e);
    }
}
startServer();