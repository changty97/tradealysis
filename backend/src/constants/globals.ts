import { IMongoOptions } from "../models/IMongoOptions";
const PATH_TO_CONTROLLERS = "./dist/controllers/*.js";
const PORT = `3001`;

const mongoOptions: IMongoOptions = {
/** uri: process.env.DB_URI, db: process.env.DB_DB, collection: process.env.DB_COLLECTION **/
    uri: 'mongodb://localhost:27017',
    db: 't_db',
    collection: "t_1"
};

export { PATH_TO_CONTROLLERS, PORT, mongoOptions };
