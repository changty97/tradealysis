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
                            if (results2.length !== 0)
                            {
                                const key : ObjectId = results2[0];
                                retVal =  key.toString();
                                return retVal;
                            }
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
            if (results !== null)
            {
                if (results.length !== 0)
                {
                    return theCollectionUserTable.distinct(
                        "uname", {
                            "_id": results[0]
                        }
                    ).then((results2 : ObjectId[] ) =>
                    {
                        if (results2 !== null)
                        {
                            if (results2.length !== 0)
                            {
                                const un : ObjectId = results2[0];
                                retVal =  un.toString();
                                return retVal;
                            }
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
export { correctLogin, correctLoginKey, userFromKey };
