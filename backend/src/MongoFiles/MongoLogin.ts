import { MongoClient, ObjectId, Db, Collection } from "mongodb";
import { userMongoOptions } from "../constants/globals";
import { MyCrypto } from "../Encryption/MyCrypto";
import { BE_KEY } from "../constants/globals";
/**
 * Method returns key based on username, passwork pair
 * @return key:string associated with username, password pair or "" if username, password pair not in db
 */
async function correctLoginKey(username: string, password: string): Promise<string>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(userMongoOptions.uri).then((connection: MongoClient) =>
    {
        client = connection;
        const db: Db = client.db(userMongoOptions.db);
        const theCollectionUserTable: Collection = db.collection(userMongoOptions.collections['userTable']);
        const theCollectionKeyTable:  Collection = db.collection(userMongoOptions.collections['userKey']);
        const myCrypt:MyCrypto = MyCrypto.getInstance();

        return theCollectionUserTable.distinct("_id", {
            "uname": username,
            "pssd": myCrypt.getSHA3(password)
        }).then((results: ObjectId[] ) =>
        {
            if (results && results.length !== 0)
            {
                return theCollectionKeyTable.distinct(
                    "key", {
                        "user_obj_id": results[0].toString()
                    }
                ).then((results2: ObjectId[] ) =>
                {
                    return (results2 && results2[0]) ? results2[0].toString() : "";
                });
            }
            return "";
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
 * @returns {string} username if key matches with user, else empty str ""
 **/
async function userFromKey(key: string):Promise<string>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(userMongoOptions.uri).then((connection: MongoClient) =>
    {
        client = connection;
        const db: Db = client.db(userMongoOptions.db);
        const theCollectionUserTable: Collection = db.collection(userMongoOptions.collections['userTable']);
        const theCollectionKeyTable: Collection = db.collection(userMongoOptions.collections['userKey']);
        return theCollectionKeyTable.distinct("user_obj_id", {
            "key": key
        }).then((results: ObjectId[] ) =>
        {
            if (results && results.length !== 0)
            {
                return theCollectionUserTable.distinct(
                    "uname", {
                        "_id": new ObjectId(results[0])
                    }
                ).then((results2: ObjectId[] ) =>
                {
                    return (results2 && results2[0]) ? results2[0].toString() : "";
                });
            }
            return "";
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
 * Method returns true if a user currently exists in the backend db. If the user
 * does not exists, return false
 * @return {boolean} false if user does not exist, true if the user exists
 */
async function userExists(username: string): Promise<boolean>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(userMongoOptions.uri).then((connection: MongoClient) =>
    {
        client = connection;
        const db: Db = client.db(userMongoOptions.db);
        const theCollection: Collection = db.collection(userMongoOptions.collections['userTable']);
		
        return (theCollection.find(
            {
                "uname": username
            }).count()
        ).then((results: number) =>
        {
            return (results > 0);
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

export { correctLoginKey, userFromKey, userExists };
