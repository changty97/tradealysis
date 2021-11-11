import { MongoClient, Db, Collection } from "mongodb";
import { userMongoOptions } from "../constants/globals";

async function allUserSessions(key: string):Promise<string[]>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(userMongoOptions.uri).then((connection: MongoClient) =>
    {
        client = connection;
        const db: Db = client.db(userMongoOptions.db);
        const theCollectionKeyTable: Collection = db.collection(userMongoOptions.collections['userKey']);
        const theCollectionSessionsTable: Collection = db.collection(userMongoOptions.collections['userSessions']);

        return theCollectionKeyTable.distinct("user_obj_id", {
            "key": key
        }).then((results) =>
        {
            const emptyArr:string[] = [];
            if (results && results.length !== 0)
            {
                return theCollectionSessionsTable.distinct(
                    "session_ids", {
                        "user_obj_id": results[0]
                    }
                ).then((results2: string[] ) =>
                {
                    return (results2) ? results2 : emptyArr;
                });
            }
            return emptyArr;
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

export { allUserSessions };
