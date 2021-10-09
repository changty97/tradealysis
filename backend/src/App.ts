import express from "express";
import { Server } from "typescript-rest";
import cors from 'cors';
import { PATH_TO_CONTROLLERS } from "./constants/globals";

const app: express.Application = express();
const allowedToMakeRequests = ['http://localhost:3000', 'http://localhost:3001'];
const options: cors.CorsOptions = {
    origin: allowedToMakeRequests
};
app.use(cors(options));

Server.loadServices(app, PATH_TO_CONTROLLERS);
Server.swagger(app, {
    endpoint: "swagger",
    filePath: "./src/swagger/swagger.json"
});

export { app };

