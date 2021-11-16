import { MongoClient, ObjectId, Db, Collection } from "mongodb";
import { userMongoOptions } from "../constants/globals";

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

export { accountValuesFromKey };
