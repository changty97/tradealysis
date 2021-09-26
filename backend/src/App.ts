import express from "express";
import { Server } from "typescript-rest";
import { PATH_TO_CONTROLLERS } from "./constants/globals";


const app: express.Application = express();

Server.loadServices(app, PATH_TO_CONTROLLERS);

Server.swagger(app, {
    endpoint: "swagger",
    filePath: "./src/swagger/swagger.json"
});

export { app };
