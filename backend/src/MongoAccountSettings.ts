import { InsertOneResult, MongoClient, ObjectId, Db, Collection } from "mongodb";
import { userMongoOptions } from "./constants/globals";
import { userExists } from "./MongoLogin";

async function fnameFromKey(key:string, item:string):Promise<string>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(userMongoOptions.uri).then((connection: MongoClient) =>
    {
        client = connection;
        const db: Db = client.db(userMongoOptions.db);
        const theCollectionUserTable: Collection = db.collection(userMongoOptions.collections['userTable']);
        const theCollectionKeyTable:  Collection = db.collection(userMongoOptions.collections['userKey']);
        const theCollectionAccountTable:  Collection = db.collection(userMongoOptions.collections['userAccount']);
		
        let retVal = "";
        return theCollectionKeyTable.distinct("user_obj_id", {
            "key": key
        }).then((results : ObjectId[] ) =>
        {
            if (results !== null && results.length !== 0)
            {
                return theCollectionAccountTable.distinct(
                    item, {
                        "user_obj_id": results[0]
                    }
                ).then((results2 : ObjectId[] ) =>
                {
                    retVal = (results2 !== null) ? results2[0].toString() : retVal;
                    return retVal;
                });
            }
            return retVal;
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

export { fnameFromKey };
