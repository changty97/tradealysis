import { Document, InsertOneResult, MongoClient } from "mongodb";
import { mongoOptions } from "../constants/globals";
import { ISession } from "../models/ISession";


async function removeItem(idVal:number):Promise<void>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(mongoOptions.uri)
        .then(async(connection: MongoClient) =>
        {
            client = connection;
            await client.db(mongoOptions.db).collection(mongoOptions.collection).deleteOne({
                id: idVal
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

async function saveTable(dataArray: any): Promise<void>
{
    let client: MongoClient | null = null;
    try
    {
        client = await MongoClient.connect(mongoOptions.uri);

        for (let i = 0; i < dataArray.length; i++)
        {
            const valsToInsert = {
            };
            for (const [key, value] of Object.entries(dataArray[i]))
            {
                const theKey = key;
                const theValue = value;
                Object.defineProperty(valsToInsert, theKey, {
                    value: theValue,
                    writable: true,
                    enumerable: true
                });
            }
            const descriptorID = Object.getOwnPropertyDescriptor(valsToInsert, 'id');
            await client.db(mongoOptions.db).collection(mongoOptions.collection).updateOne(
                {
                    id: descriptorID.value
                },
                {
                    "$set": valsToInsert
                },
                {
                    "upsert": true
                }
            );
        }
    }
    catch (err)
    {
        Promise.reject(err);
    }

    if (client)
    {
        await client.close();
    }

    return;
}

/**
	Returns data from db to front end Sheet Component
**/
async function theSaveData(): Promise<any[]>
{
    let client: MongoClient | null = null;
	
    try
    {
        client = await MongoClient.connect(mongoOptions.uri);
        const x = await client.db(mongoOptions.db).collection(mongoOptions.collection).find({
        }).toArray();
        if (client)
        {
            client.close();
        }
        return x;
    }
    catch (err)
    {
        return Promise.reject(err);
    }
}


function getAllSessions(): Promise<ISession[]>
{
    let client: MongoClient | null = null;

    return MongoClient.connect(mongoOptions.uri)
        .then((connection: MongoClient) =>
        {
            client = connection;
            return client.db(mongoOptions.db)
                .collection(mongoOptions.collection)
                .find({
                }).toArray();
        })
        .then((documents: Document[]) =>
        {
            return documents.map((document: Document, index: number) =>
            {
                return {
                    name: document.name || index,
                    sessionId: document["_id"]
                };
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

export { removeItem, saveTable, theSaveData, getAllSessions };
