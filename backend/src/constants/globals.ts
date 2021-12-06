import { IMongoOptions, IMongoOptionsMult } from "../models/IMongoOptions";
import { MyCrypto } from "../Encryption/MyCrypto";
const PATH_TO_CONTROLLERS = "./dist/controllers/*.js";
const PORT: string = process.env.PORT;

const mongoOptions: IMongoOptions = {
    uri: process.env.DB_URI,
    db: process.env.DB_DB,
    collection: process.env.DB_COLLECTION
};

const userMongoOptions: IMongoOptionsMult = {
    uri: process.env.DB_URI,
    db: process.env.USER_DB,
    collections: {
        "userTable": process.env.USERTABLE_COLLECTION,
	    "userKey": process.env.USERKEY_COLLECTION,
	    "userAccount": process.env.USERACCOUNT_COLLECTION,
	    "userSessions": process.env.USERSESSIONS_COLLECTION,
    }
};

let BE_KEY:string = ((process.env.REACT_APP_BE_KEY) ? process.env.REACT_APP_BE_KEY : "") as string;
if (BE_KEY && BE_KEY !== "")
{
    BE_KEY = MyCrypto.getInstance().decryption(BE_KEY, '1b88ae1df8559ad7d0701b9ce40117c74f98d9524909c712a73e52d325a8c72ac303623be9eb5b46d65e2449a6b284f7');
}

export { PATH_TO_CONTROLLERS, PORT, mongoOptions, userMongoOptions, BE_KEY };
