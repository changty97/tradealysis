import { MongoClient, ObjectId, Db, Collection } from "mongodb";
import { userMongoOptions, mongoOptions } from "../constants/globals";
import { userFromKey } from "./MongoLogin";
import { MyCrypto } from "../Encryption/MyCrypto";
import { BE_KEY } from "../constants/globals";

async function accountValuesFromKey(FE_KEY:string, key: string):Promise<any>
{
    let client: MongoClient | null = null;
    const myCrypt:MyCrypto = MyCrypto.getInstance();
    try
    {
        client = await MongoClient.connect(userMongoOptions.uri);
        const db: Db = client.db(userMongoOptions.db);
        const theCollectionKeyTable: Collection = db.collection(userMongoOptions.collections['userKey']);
        const theCollectionAccountTable: Collection = db.collection(userMongoOptions.collections['userAccount']);
        const userObjID = await theCollectionKeyTable.distinct("user_obj_id", {
            "key": key
        });
        if (userObjID.length > 0)
        {
            const item = await theCollectionAccountTable.findOne({
                "user_obj_id": userObjID[0]
            });
            delete item._id;
            delete item.user_obj_id;
            const theKey = myCrypt.decryptMultKeys(key, [FE_KEY, BE_KEY]);
            item.fName = myCrypt.decryption(item.fName, theKey);
            item.lName = myCrypt.decryption(item.lName, theKey);
            item.email = myCrypt.decryption(item.email, theKey);
            item.phone = myCrypt.decryption(item.phone, theKey);
            item.bdate = myCrypt.decryption(item.bdate, theKey);
            return item;
        }
        return null;
    }
    catch (err)
    {
        Promise.reject(err);
    }
    if (client)
    {
        client.close();
    }
}

async function sameAccount(key:string, account:string):Promise<boolean>
{
    return ((await userFromKey(key)) === account);
}

async function doesThisAccountExist(possibleNewAccount: string):Promise<boolean>
{
    let retVal = false; // assume worst case the account exists if invalid key or invalid account
    if (possibleNewAccount)
    {
        let client: MongoClient | null = null;
        try
        {
            client = await MongoClient.connect(userMongoOptions.uri);
            const db: Db = client.db(userMongoOptions.db);
            const theCollectionUserTable: Collection = db.collection(userMongoOptions.collections['userTable']);
            const uname = await theCollectionUserTable.distinct("uname", {
                "uname": possibleNewAccount
            });
            retVal = (uname.length > 0);
        }
        catch (err)
        {
            Promise.reject(err);
        }
        if (client)
        {
            client.close();
        }
    }
    return retVal;
}

async function modifyAccountName(key: string, possibleNewAccount:string):Promise<void>
{
    if (!(await doesThisAccountExist(possibleNewAccount)))
    {
        let client: MongoClient | null = null;
        let client2: MongoClient | null = null;
        try
        {
            client = await MongoClient.connect(userMongoOptions.uri);
            const db: Db = client.db(userMongoOptions.db);
            const theCollectionUserTable: Collection = db.collection(userMongoOptions.collections['userTable']);
            const theCollectionKeyTable: Collection = db.collection(userMongoOptions.collections['userKey']);
            const theCollectionUserSessionsTable: Collection = db.collection(userMongoOptions.collections['userSessions']);
			
            const currentUserName:string = await(userFromKey(key));
            theCollectionUserTable.updateOne({
                "uname": currentUserName
            }, {
                $set: {
                    "uname": possibleNewAccount
                }
            });
			
            const userObjID = await theCollectionKeyTable.distinct("user_obj_id", {
                "key": key
            });
            const specificUserSession:string[] = await theCollectionUserSessionsTable.distinct("session_ids", {
                "user_obj_id": userObjID[0]
            });
            if (userObjID && userObjID.length > 0)
            {
                client2 = await MongoClient.connect(mongoOptions.uri);
                const db2:Db = client.db(mongoOptions.db);
                for (let i = 0; i < specificUserSession.length; i++)
                {
                    let oldSession = `${currentUserName  }_${  specificUserSession[i]}`;
                    let newSession = `${possibleNewAccount  }_${  specificUserSession[i]}`;
                    try
                    {
                        await db2.collection(oldSession).rename(newSession);
                    }
                    catch (e)
                    {
                        oldSession = ""; newSession = "";
                    }
                }
            }
			
        }
        catch (err)
        {
            Promise.reject(err);
        }
        if (client)
        {
            client.close();
        }
        if (client2)
        {
            client2.close();
        }
    }
}

async function changePssd(key:string, oldPassword:string, newPassword:string):Promise<boolean>
{
    let retVal = false;
    const user:string|null = await userFromKey(key);
    if (user && user !== "")
    {
        let client: MongoClient | null = null;
        try
        {
            client = await MongoClient.connect(userMongoOptions.uri);
            const db: Db = client.db(userMongoOptions.db);
            const theCollectionKeyTable: Collection = db.collection(userMongoOptions.collections['userKey']);
            const theCollectionUserTable: Collection = db.collection(userMongoOptions.collections['userTable']);
            const mc = MyCrypto.getInstance();
			
            const oldPasswordHash:string = mc.getSHA3(oldPassword, 128);
            const userObjID = await theCollectionKeyTable.distinct("user_obj_id", {
                "key": key
            });
            if (userObjID.length > 0)
            {
                const item = await theCollectionUserTable.distinct("pssd", {
                    "_id": new ObjectId(userObjID[0]),
                    "uname": user,
                });
                if (item.length > 0 && (item[0] === oldPasswordHash) && (newPassword && newPassword.length > 0))
                {
                    await theCollectionUserTable.updateOne({
                        "_id": new ObjectId(userObjID[0]),
                        "uname": user,
                        "pssd": oldPasswordHash
                    }, {
                        $set: {
                            "pssd": mc.getSHA3(newPassword, 128)
                        }
                    });
                    retVal = true;
                }
            }
        }
        catch (err)
        {
            Promise.reject(err);
        }
        if (client)
        {
            client.close();
        }
    }
    return retVal;
}

async function changeUserAccount(FE_KEY:string, key:string, firstName:string, lastName:string, email:string, phone:string, bdate:string):Promise<boolean>
{
    let retVal = false;
    let client: MongoClient | null = null;
    try
    {
        client = await MongoClient.connect(userMongoOptions.uri);
        const db: Db = client.db(userMongoOptions.db);
        const theCollectionKeyTable: Collection = db.collection(userMongoOptions.collections['userKey']);
        const theCollectionUserAccountTable: Collection = db.collection(userMongoOptions.collections['userAccount']);
		
		 const userObjID = await theCollectionKeyTable.distinct("user_obj_id", {
            "key": key
        });
        if (userObjID && userObjID.length > 0)
        {
            const myCrypt = MyCrypto.getInstance();
            const theKey = myCrypt.decryptMultKeys(key, [FE_KEY, BE_KEY]);
            await theCollectionUserAccountTable.updateOne({
                "user_obj_id": userObjID[0]
            }, {
                $set: {
                    "fName": myCrypt.encryption(firstName, theKey),
                    "lName": myCrypt.encryption(lastName, theKey),
                    "email": myCrypt.encryption(email, theKey),
                    "phone": myCrypt.encryption(phone, theKey),
                    "bdate": myCrypt.encryption(bdate, theKey),
					
                }
            });
            retVal = true;
        }
    }
    catch (err)
    {
        Promise.reject(err);
    }
    if (client)
    {
        client.close();
    }
    return retVal;
}

export { accountValuesFromKey, doesThisAccountExist, sameAccount, modifyAccountName, changePssd, changeUserAccount };
