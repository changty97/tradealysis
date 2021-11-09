import { MongoClient, ObjectId, Db, Collection } from "mongodb";
import { userMongoOptions } from "../constants/globals";

/**
 *   Method returns the str value of @param item from the
 *   account table based on @param key in browser local
 *   storage
 *
 *   @param key:string  - key in browser local storage
 *   @param item:string - item in the account collection in db
 *
 *   @return value of column item in account table : string
**/
async function accountValueFromKey(key: string, item: string):Promise<string>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(userMongoOptions.uri).then((connection: MongoClient) =>
    {
        client = connection;
        const db: Db = client.db(userMongoOptions.db);
        const theCollectionKeyTable: Collection = db.collection(userMongoOptions.collections['userKey']);
        const theCollectionAccountTable: Collection = db.collection(userMongoOptions.collections['userAccount']);
		
        return theCollectionKeyTable.distinct("user_obj_id", {
            "key": key
        }).then((results) =>
        {
            if (results !== null && results.length !== 0)
            {
                return theCollectionAccountTable.distinct(
                    item, {
                        "user_obj_id": results[0]
                    }
                ).then((results2: ObjectId[] ) =>
                {
                    return (results2 !== null) ? results2[0].toString() : "";
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

async function accountValuesFromKey(key: string):Promise<any>
{
    let client: MongoClient | null = null;
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

export { accountValueFromKey, accountValuesFromKey };
