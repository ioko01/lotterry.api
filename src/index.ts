import express from "express";
import { config } from "dotenv";
import Mongoose from "mongoose";
config();
import cookieParser from "cookie-parser";
import createServer from "./createServer";

const { HOST_NAME, DB_USERNAME, DB_PASSWORD, DB_ENDPOINT, DB_NAME, FRONT_URI } =
    process.env;

const server = async () => {
    try {
        await Mongoose.connect(
            `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_ENDPOINT}/${DB_NAME}?retryWrites=true&w=majority`,
            {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            }
        );
        const PORT: string | number = process.env.PORT || 8000;
        const app = express();
        app.use(cookieParser());

        const server = await createServer();

        server.applyMiddleware({
            app,
            cors: { origin: FRONT_URI, credentials: true },
        });

        app.listen(PORT, () => {
            console.log(
                `App listen API at PORT: http://${HOST_NAME}:${PORT}${server.graphqlPath}`
            );
        });
    } catch (error) {
        throw error;
    }
};

server();
