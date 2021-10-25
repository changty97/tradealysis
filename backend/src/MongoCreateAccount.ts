import { InsertOneResult, MongoClient, ObjectId, Db, Collection } from "mongodb";
import { mongoOptionsLogin, mongoOptionsUserTable, mongoOptionsUserKey, mongoOptionsUserAccount, mongoOptionsUserSessions } from "./constants/globals";
import { userExists } from "./MongoLogin";

/**
 * Create account method:
 * 1. checks if user exists (by username). If it does, method returns 0 and we are done
 * 2. adds username, password to userTable collection
 * 3. adds user data to account collection related by _id <- user_obj_id from userTable collection
 * 4. add key to key table and relate it to user by _id <- user_obj_id from userTable collection
 * 5. add item to sessiontable with empty array (which will contain str values which map sessionids to users by _id <- user_obj_id from userTable collection
 * 6. add 1 item to sessionid array being created. the sessionid will be "username" + "_#" where # is # of sessions a user has. It is preinitialized to 1
 *    automatically
**/
async function createAccount(username:string, password:string, fName:string, lName:string, email:string, phone:string, bdate:string): Promise<number>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(mongoOptionsUserTable.uri).then((connection: MongoClient) =>
    {
        client = connection;
        const db: Db = client.db(mongoOptionsUserTable.db);
        const theCollectionUserTable: Collection       = db.collection(mongoOptionsUserTable.collection);
        const theCollectionAccountTable:  Collection   = db.collection(mongoOptionsUserAccount.collection);
        const theCollectionKeyTable:  Collection       = db.collection(mongoOptionsUserKey.collection);
        const theCollectionSessionTable:  Collection   = db.collection(mongoOptionsUserSessions.collection);

        return userExists(username).then((res:number)=>
        {
            if (res == 1)
            {
                return 0;
            }
            else
            {
				 return theCollectionUserTable.insertOne({
                    "uname": username,
                    "pssd": password
                }).then((res2)=>
                {
                    if (res2 !== null)
                    {
                        if (res2.insertedId !== null)
                        {
                            return theCollectionAccountTable.insertOne(
                                {
                                    "user_obj_id": res2.insertedId,
                                    "fName": fName,
                                    "lName": lName,
                                    "email": email,
                                    "phone": phone,
                                    "bdate": bdate
                                }
                            ).then((res3)=>
                            {
                                if (res3 !== null)
                                {
                                    if (res3.insertedId !== null)
                                    {
                                        const originalKey = `${username  }_key`;
                                        return theCollectionKeyTable.insertOne({
                                            "key": originalKey,
                                            "user_obj_id": res2.insertedId,
                                            "active": 1
                                        }).then((res4)=>
                                        {
                                            return theCollectionSessionTable.insertOne({
                                                "user_obj_id": res2.insertedId,
                                                "session_ids": [ ]
                                            })
                                                .then((res5)=>
                                                {
                                                    const newSessionName = `${username  }_1`;
                                                    return theCollectionSessionTable.updateOne(
                                                        {
                                                            "user_obj_id": res2.insertedId
                                                        },
                                                        {
                                                            $push: {
                                                                "session_ids": newSessionName
                                                            }
                                                        },
                                                    ).then((res6)=>
                                                    {
                                                        return 1;
                                                    })
                                                        .catch((err: Error)=>
                                                        {
                                                            return Promise.reject(err);
                                                        });
                                                })
                                                .catch((err: Error)=>
                                                {
                                                    return Promise.reject(err);
                                                });
                                        })
                                            .catch((err: Error)=>
                                            {
                                                return Promise.reject(err);
                                            });
                                    }
                                }
                                return 0;
                            })
                                .catch((err: Error) =>
                                {
                                    return Promise.reject(err);
                                });
                        }
                    }
                    return 0;
                })
                    .catch((err: Error) =>
                    {
                        return Promise.reject(err);
                    });
            }
        })
            .catch((err: Error) =>
            {
                return Promise.reject(err);
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
