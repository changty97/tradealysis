import { IMongoOptions } from "../models/IMongoOptions";

const PATH_TO_CONTROLLERS = "./dist/controllers/*.js";
const PORT: string = process.env.PORT;
const mongoOptions: IMongoOptions = {
    uri: process.env.DB_URI,
    db: process.env.DB_DB,
    collection: process.env.DB_COLLECTION
};

export { PATH_TO_CONTROLLERS, PORT, mongoOptions };
