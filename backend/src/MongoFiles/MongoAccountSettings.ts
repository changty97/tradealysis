import { MongoClient, ObjectId, Db, Collection } from "mongodb";
import { userMongoOptions, mongoOptions } from "../constants/globals";
import { userFromKey } from "./MongoLogin";
import { MyCrypto } from "../Encryption/MyCrypto";
import { BE_KEY } from "../constants/globals";

/**
	Get user Account info stored in AccountSettings.tsx on front end
	@param {string} FE_KEY: frount end key
	@param {string} key: userKey
	@returns {object || null }: null if key is invalid or no user correspnds to it, otherwise returns personal data
**/
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

/**
	Determine if @param account is the same as current username
	@param {string} key: userKey
	@param {string} account: a arbitrary account name to compare with current user name
	@returns {boolean} (account == current Username)
**/
async function sameAccount(key:string, account:string):Promise<boolean>
{
    return ((await userFromKey(key)) === account);
}

/**
	See if an account exists with the following username @param possibleNewAccount
	@param {string} possibleNewAccount:
	@return {boolean} possibleNewAccount exists
**/
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

/**
	Modify Account Name If account uname does not already exists
	@param {string} key: userKey
	@param {string} possibleNewAccount: possible new account name
	
	Account name is changed if account does not exist already
**/
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

/**
	Change Password
	@param {string} key: userKey
	@param {string} oldPassword: old Password
	@param {string} newPassword: new password changing it to
	
	If key is invalid (does not correspond to a user), or oldPassword is incorrect,
	Password will not changePssd
	@return {boolean} password Changed
**/
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
			
            const oldPasswordHash:string = mc.getSHA3(oldPassword);
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
                            "pssd": mc.getSHA3(newPassword)
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

/**
	Change private user account data
	@param {string} FE_KEY: Front end AES 256 KEY
	@param {string} key: userKey
	@param {string} firstName: first name
	@param {string} lastName: last name
	@param {string} email: email
	@param {string} bdate: bdate
	
	@returns {boolean} whether personal data changed in the database
**/
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
