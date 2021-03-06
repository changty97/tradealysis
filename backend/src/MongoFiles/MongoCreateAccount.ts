import { MongoClient, Db, Collection } from "mongodb";
import { userMongoOptions } from "../constants/globals";
import { userExists } from "./MongoLogin";
import { MyCrypto } from "../Encryption/MyCrypto";
import { BE_KEY } from "../constants/globals";
/**
 * Create account method:
 * 1. checks if user exists (by username). If it does, method returns 0 and we are done
 * 2. adds username, password to userTable collection
 * 3. adds user data to account collection related by _id <- user_obj_id from userTable collection
 * 4. add key to key table and relate it to user by _id <- user_obj_id from userTable collection
 * 5. add item to sessiontable with empty array (which will contain str values which map sessionids to users by _id <- user_obj_id from userTable collection
 * 6. add 1 item to sessionid array being created. the sessionid will be "username" + "_#" where # is # of sessions a user has. It is preinitialized to 1
 *    automatically
 *   @return {boolean} true/false if account is created and all db collections populated
**/
async function createAccount(FE_KEY:string, username: string, password: string, fName: string, lName: string, email: string, phone: string, bdate: string): Promise<boolean>
{
    let client: MongoClient | null = null;
    
    return MongoClient.connect(userMongoOptions.uri).then((connection: MongoClient) =>
    {
        client = connection;
        const db: Db = client.db(userMongoOptions.db);
        const theCollectionUserTable: Collection = db.collection(userMongoOptions.collections['userTable']);
        const theCollectionAccountTable: Collection = db.collection(userMongoOptions.collections['userAccount']);
        const theCollectionKeyTable: Collection = db.collection(userMongoOptions.collections['userKey']);
        const theCollectionSessionTable: Collection = db.collection(userMongoOptions.collections['userSessions']);

        return userExists(username).then((res: boolean)=>
        {
            if (!res)
            {
                const myCrypt:MyCrypto = MyCrypto.getInstance();
                const pssdHash:string = myCrypt.getSHA3(password);
                const theKey = myCrypt.generateKey(pssdHash);
				
                return theCollectionUserTable.insertOne({
                    "uname": username,
                    "pssd": pssdHash
                }).then((res2)=>
                {
                    if (res2 && res2.insertedId)
                    {
                        return theCollectionAccountTable.insertOne(
                            {
                                "user_obj_id": res2.insertedId.toString(),
                                "fName": myCrypt.encryption(fName, theKey),
                                "lName": myCrypt.encryption(lName, theKey),
                                "email": myCrypt.encryption(email, theKey),
                                "phone": myCrypt.encryption(phone, theKey),
                                "bdate": myCrypt.encryption(bdate, theKey)
                            }
                        ).then((res3)=>
                        {
                            if (res3 && res3.insertedId)
                            {
                                return theCollectionKeyTable.insertOne({
                                    "key": myCrypt.encryptMultKeys(theKey, [FE_KEY, BE_KEY]),
                                    "user_obj_id": res2.insertedId.toString(),
                                    "active": true
                                }).then(()=>
                                {
                                    return theCollectionSessionTable.insertOne({
                                        "user_obj_id": res2.insertedId.toString(),
                                        "session_ids": [ ]
                                    })
                                        .then(()=>
                                        {
                                            return theCollectionSessionTable.updateOne(
                                                {
                                                    "user_obj_id": res2.insertedId.toString()
                                                },
                                                {
                                                    $push: {
                                                        "session_ids": `myData`
                                                    }
                                                },
                                            ).then(()=>
                                            {
                                                return true;
                                            });
                                        });
                                });
                            }
                            return false;
                        });
                    }
                    return false;
                });
            }
            return false;
        });
    })
        .catch((err: Error) =>
        {
            return Promise.reject(err);
        })
        .finally(() =>
        {
            if (client)
            {
                client.close();
            }
        });
}

export { createAccount };
