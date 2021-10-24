import { InsertOneResult, MongoClient, ObjectId, Db, Collection } from "mongodb";
import { mongoOptionsLogin, mongoOptionsUserTable, mongoOptionsUserKey, mongoOptionsUserAccount, mongoOptionsUserSessions } from "./constants/globals";
//import * as mongoDB from "mongodb";

/** Returns 1 on success, 0 on failure **/
async function correctLogin(username:string, password:string): Promise<number>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(mongoOptionsUserTable.uri).then((connection: MongoClient) =>
    {
        client = connection;
        const db: Db = client.db(mongoOptionsUserTable.db);
        const theCollection: Collection = db.collection(mongoOptionsUserTable.collection);
        const x = (theCollection.find(
            {
                "uname": username,
                "pssd": password,
            }).count());
        return x;
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

async function correctLoginKey(username:string, password:string): Promise<string>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(mongoOptionsUserTable.uri).then((connection: MongoClient) =>
    {
        client = connection;
        const db: Db = client.db(mongoOptionsUserTable.db);
        const theCollectionUserTable: Collection = db.collection(mongoOptionsUserTable.collection);
        const theCollectionKeyTable:  Collection = db.collection(mongoOptionsUserKey.collection);

        let retVal = "";
        return theCollectionUserTable.distinct("_id", {
            "uname": username,
            "pssd": password
        }).then((results : ObjectId[] ) =>
        {
            if (results !== null)
            {
                if (results.length !== 0)
                {
                    return theCollectionKeyTable.distinct(
                        "key", {
                            "user_obj_id": results[0]
                        }
                    ).then((results2 : ObjectId[] ) =>
                    {
                        if (results2 !== null)
                        {
                            retVal = results2[0].toString();
                        }
                        return retVal;
                    })
                        .catch((err: Error) =>
                        {
                            return Promise.reject(err);
                        });
                }
            }
            return retVal;
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






async function userFromKey(key:string):Promise<string>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(mongoOptionsUserTable.uri).then((connection: MongoClient) =>
    {
        client = connection;
        const db: Db = client.db(mongoOptionsUserTable.db);
        const theCollection: Collection = db.collection(mongoOptionsUserTable.collection);
        const theCollectionUserTable: Collection = db.collection(mongoOptionsUserTable.collection);
        const theCollectionKeyTable:  Collection = db.collection(mongoOptionsUserKey.collection);
		
        let retVal = "";
		
        return theCollectionKeyTable.distinct("user_obj_id", {
            "key": key
        }).then((results : ObjectId[] ) =>
        {
            if (results != null)
            {
                if (results.length != 0)
                {
                    return theCollectionUserTable.distinct(
                        "uname", {
                            "_id": results[0]
                        }
                    ).then((results2 : ObjectId[] ) =>
                    {
                        if (results2 != null)
                        {
                            retVal = results2[0].toString();
                        }
                        return retVal;
                    })
                        .catch((err: Error) =>
                        {
                            return Promise.reject(err);
                        });
                }
            }
            return retVal;
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

























/** Returns 1 on success, 0 on failure **/
async function userExists(username:string): Promise<number>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(mongoOptionsUserTable.uri).then((connection: MongoClient) =>
    {
        client = connection;
        const db: Db = client.db(mongoOptionsUserTable.db);
        const theCollection: Collection = db.collection(mongoOptionsUserTable.collection);
        return (theCollection.find(
            {
                "uname": username
            }).count()
        ).then((results: number) =>
        {
            if (results > 0)
            {
                return 1;
            }
            return 0;
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

async function createAccount(username:string, password:string, fName:string, lName:string,
							 email:string, phone:string, bdate:string): Promise<number>
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
											
                                            return 1;
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
        }
        );
}

export { correctLogin, correctLoginKey, userFromKey, userExists, createAccount };
