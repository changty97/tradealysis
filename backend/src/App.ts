import express from "express";
import { Server } from "typescript-rest";
import { PATH_TO_CONTROLLERS } from "./constants/globals";
import cors from 'cors';

/** Setup express application **/

const app: express.Application = express();
const allowedToMakeRequests = ['https://tradealysis.tk', 'http://localhost:3000', 'http://localhost:3001'];

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
