import { MongoClient, Db, Collection } from "mongodb";
import { userMongoOptions, mongoOptions } from "../constants/globals";
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

/**
	Helper method:
	@param val: val you want to name a session
		val must not be "" or null
	@param arr: sessionID's for user
		arr must not be null, and it is assumed if
		using this method, their is a user key relation
	@return
		if val is not a session, val is returned
		else
			val + '_n' is checked where n >=2
**/
function newSessionName(val:string, arr:string[]):string
{
    let newVal:string = val;
    let valNotFound = true;
    for (let count = 2; valNotFound; count++)
    {
        valNotFound = false;
        for (let i = 0; i < arr.length; i++)
        {
            if (newVal === arr[i])
            {
                valNotFound = true;
                arr.splice(i, 1);
                newVal = `${val  }_${ count}`;
                break;
            }
        }
    }

    return newVal;
}

async function createNewSession(key:string, newCollectionName:string):Promise<string>
{
    let userName:string | null = null;
    let client: MongoClient | null = null;
    let theNewCollectionName = "";
    try
    {
        userName = await userFromKey(key);
        if (userName && userName.trim() !== "")
        {
            client = await MongoClient.connect(userMongoOptions.uri);
            const db: Db = client.db(userMongoOptions.db);
            const theCollectionKeyTable: Collection = db.collection(userMongoOptions.collections['userKey']);
            const theCollectionSessionsTable: Collection = db.collection(userMongoOptions.collections['userSessions']);
            const userObjIDArr = await theCollectionKeyTable.distinct("user_obj_id", {
                "key": key
            });

            if (userObjIDArr && userObjIDArr.length !== 0) // no userObjId for user based on key
            {
                theNewCollectionName = newCollectionName.trim();
                const sessions = (await theCollectionSessionsTable.distinct(
                    "session_ids", {
                        "user_obj_id": userObjIDArr[0]
                    }
                ));
                theNewCollectionName = (theNewCollectionName && theNewCollectionName.trim() === "") ? "myData" : theNewCollectionName;
                theNewCollectionName = newSessionName(theNewCollectionName, sessions);
				
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
        const uname = await userFromKey(key);
        if (!uname || uname === "")
        {
            return sessionName;
        }
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
            let deleteTable: Collection | null = null;
            try
            {
                deleteTable = await db2.collection(`${uname  }_${  sessionName}`);
                await deleteTable.drop();
            }
            catch (error) // exception thrown if deleteTable collection does not exist. No worry
            {
                deleteTable = null;
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


async function changeTheSessionName(key:string, oldName:string, newName:string):Promise<boolean>
{
    let client: MongoClient | null = null;
    let client2: MongoClient | null = null;
    try
    {
        if (oldName.trim() === "" || newName.trim() === "")
        {
            return false;
        }
        if (oldName === newName) // changing name to newname is the same as doing nothing. We are done
        {
            return true;
        }
        const uname:string = await userFromKey(key);
        if (uname && uname !== "")
        {
            client = await MongoClient.connect(userMongoOptions.uri);
            client2 = await MongoClient.connect(mongoOptions.uri);
            const db: Db = client.db(userMongoOptions.db);
            const db2: Db = client2.db(mongoOptions.db);
            const theCollectionKeyTable: Collection = db.collection(userMongoOptions.collections['userKey']);
            const theCollectionSessionTable: Collection = db.collection(userMongoOptions.collections['userSessions']);
            const userSessions:string[] = await allUserSessions(key);
            let foundOldName = false;
            let foundNewName = false;

            for (let i = 0; i < userSessions.length && !foundNewName; i++)
            {
                if (userSessions[i] === newName)
                {
                    foundNewName = true;
                    break;
                }
                else if (userSessions[i] === oldName)
                {
                    foundOldName = true;
                }
            }
            if (foundOldName && !foundNewName)
            {
                const theOldSessionCollection = `${uname  }_${  oldName}`;
                const theNewSessionCollection = `${uname  }_${  newName}`;
                const userObjID = await theCollectionKeyTable.distinct("user_obj_id", {
                    "key": key
                });
                if (userObjID && userObjID.length !== 0)
                {
                    const updateVal = await theCollectionSessionTable.updateOne( {
                        "user_obj_id": userObjID[0],
                        "session_ids": oldName
                    }, {
                        $set: {
                            "session_ids.$": newName
                        }
                    },);
                    if (updateVal && updateVal.acknowledged)
                    {
                        let oldCollection: Collection|null = db2.collection(theOldSessionCollection);
                        try
                        {
                            const oldCollection: Collection = db2.collection(theOldSessionCollection);
                            await oldCollection.rename(theNewSessionCollection);
                        }
                        catch (e) // expected error if someone has not saved the table with at least 1 item
                        {
                            oldCollection = null;
                        }
                        return true;
                    }
                }
            }
        }
        return false;
    }
    catch (err)
    {
        return Promise.reject(err);
    }
    finally
    {
        if (client)
        {
            client.close();
        }
        if (client2)
        {
            client2.close();
        }
    }
}

export { allUserSessions, createNewSession, removeSession, changeTheSessionName };
