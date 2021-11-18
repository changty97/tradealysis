import { MongoClient, Db, Collection } from "mongodb";
import { mongoOptions } from "../constants/globals";
import { userMongoOptions } from "../constants/globals";
import { userFromKey } from "./MongoLogin";

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



async function createNewSession(key:string, newCollectionName:string):Promise<string>
{
    let client: MongoClient | null = null;
    let theNewCollectionName = "";
    try
    {
        client = await MongoClient.connect(userMongoOptions.uri);
        const db: Db = client.db(userMongoOptions.db);
        const theCollectionKeyTable: Collection = db.collection(userMongoOptions.collections['userKey']);
        const theCollectionSessionsTable: Collection = db.collection(userMongoOptions.collections['userSessions']);
		
        const userObjIDArr = await theCollectionKeyTable.distinct("user_obj_id", {
            "key": key
        });
		
        if (userObjIDArr && userObjIDArr.length !== 0)
        {
            theNewCollectionName = newCollectionName;
            if (theNewCollectionName && theNewCollectionName.trim() === "")
            {
                const userName = await userFromKey(key);
                if (!userName || userName === "")
                {
                    return theNewCollectionName;
                }
                const sessions = (await theCollectionSessionsTable.distinct(
                    "session_ids", {
                        "user_obj_id": userObjIDArr[0]
                    }
                )).length + 1;
                theNewCollectionName = `${userName  }_${  sessions}`;
            }
            await theCollectionSessionsTable.updateOne(
                {
                    "user_obj_id": userObjIDArr[0]
                },
                {
                    $push: {
                        "session_ids": `${theNewCollectionName}`
                    }
                },
            );
        }
    }
    catch (err)
    {
        Promise.reject(err);
    }
    finally
    {
        if (client)
        {
            client.close();
        }
    }
    return theNewCollectionName;
}

async function removeSession(key:string, session:string):Promise<string>
{
    let client: MongoClient | null = null;
    let client2: MongoClient | null = null;
    let sessionName = "";
    try
    {
        client = await MongoClient.connect(userMongoOptions.uri);
        const db: Db = client.db(userMongoOptions.db);
        const theCollectionKeyTable: Collection = db.collection(userMongoOptions.collections['userKey']);
        const theCollectionSessionsTable: Collection = db.collection(userMongoOptions.collections['userSessions']);

        const userObjIDArr = await theCollectionKeyTable.distinct("user_obj_id", {
            "key": key
        });
		
        if (userObjIDArr && userObjIDArr.length !== 0)
        {
            sessionName = session;
            await theCollectionSessionsTable.updateOne(
                {
                    "user_obj_id": userObjIDArr[0]
                },
                {
                    $pull: {
                        "session_ids": `${sessionName}`
                    }
                },
            );
            client2 = await MongoClient.connect(mongoOptions.uri);
            const db2: Db = client2.db(mongoOptions.db);
			
            try
            {
                const deleteTable: Collection | null = await db2.collection(`${sessionName  }_stock_data`);
                await deleteTable.drop();
            }
            catch (error) // exception thrown if deleteTable collection does not exist. No worry
            {
                console.log("");
            }
        }
    }
    catch (err)
    {
        Promise.reject(err);
    }
    if (client)
    {
        client.close();
    }
    if (client2)
    {
        client2.close();
    }
    return sessionName;
}

export { allUserSessions, createNewSession, removeSession };
