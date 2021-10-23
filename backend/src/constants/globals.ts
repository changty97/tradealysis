import { IMongoOptions } from "../models/IMongoOptions";

const PATH_TO_CONTROLLERS = "./dist/controllers/*.js";
const PORT: string = process.env.PORT;
const mongoOptions: IMongoOptions = {
    uri: process.env.DB_URI,
    db: process.env.DB_DB,
    collection: process.env.DB_COLLECTION
};

/** Used for Login Authentication **/
const mongoOptionsLogin: IMongoOptions = {
    uri: process.env.DB_URI,
    db: process.env.DB_DB,
    collection: process.env.DB_COLLECTION_LOGIN
};

const mongoOptionsUserTable: IMongoOptions = {
    uri: process.env.DB_URI,
    db: process.env.USER_DB,
    collection: process.env.USERTABLE_COLLECTION
};

const mongoOptionsUserKey: IMongoOptions = {
    uri: process.env.DB_URI,
    db: process.env.USER_DB,
    collection: process.env.USERKEY_COLLECTION
};

const mongoOptionsUserAccount: IMongoOptions = {
    uri: process.env.DB_URI,
    db: process.env.USER_DB,
    collection: process.env.USERACCOUNT_COLLECTION
};

const mongoOptionsUserSessions: IMongoOptions = {
    uri: process.env.DB_URI,
    db: process.env.USER_DB,
    collection: process.env.USERSESSIONS_COLLECTION
};



export { PATH_TO_CONTROLLERS, PORT, mongoOptions, mongoOptionsLogin, mongoOptionsUserTable, mongoOptionsUserKey, mongoOptionsUserAccount, mongoOptionsUserSessions };
