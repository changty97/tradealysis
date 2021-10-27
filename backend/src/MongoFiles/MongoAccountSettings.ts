import { InsertOneResult, MongoClient, ObjectId, Db, Collection } from "mongodb";
import { userMongoOptions } from "../constants/globals";
import { userExists } from "./MongoLogin";

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
async function accountValueFromKey(key:string, item:string):Promise<string>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(userMongoOptions.uri).then((connection: MongoClient) =>
    {
        client = connection;
        const db: Db = client.db(userMongoOptions.db);
        const theCollectionUserTable: Collection = db.collection(userMongoOptions.collections['userTable']);
        const theCollectionKeyTable:  Collection = db.collection(userMongoOptions.collections['userKey']);
        const theCollectionAccountTable:  Collection = db.collection(userMongoOptions.collections['userAccount']);
		
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
                ).then((results2 : ObjectId[] ) =>
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

export { accountValueFromKey };
