import { InsertOneResult, MongoClient, ObjectId, Db, Collection } from "mongodb";
import { mongoOptionsLogin, mongoOptionsUserTable,
    mongoOptionsUserKey, mongoOptionsUserAccount,
    mongoOptionsUserSessions } from "./constants/globals";

/**
 *  If username, password are in userTable collection, return 1. Else return 0
 *  Note: Dont use this in final implementation
 *  @return 0 if user does not exist, 1+ if this user does.
 **/
async function correctLogin(username:string, password:string): Promise<number>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(mongoOptionsUserTable.uri).then((connection: MongoClient) =>
    {
        client = connection;
        const db: Db = client.db(mongoOptionsUserTable.db);
        const theCollection: Collection = db.collection(mongoOptionsUserTable.collection);
        const x = (theCollection.find({
            "uname": username,
            "pssd": password
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

/**
 * Method returns key based on username, passwork pair
 * @return key:string associated with username, password pair or "" if username, password pair not in db
 */
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

/**
 * Returns username from a key in local storage
 * @returns username:string if key matches with user, else empty str ""
 **/
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

/**
 * Method returns 1 if a user currently exists in the backend db. If the user
 * does not exists, return 0
 * @return 0 if user does not exist, 1 if the user exists
 */
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

export { correctLogin, correctLoginKey, userFromKey, userExists };
