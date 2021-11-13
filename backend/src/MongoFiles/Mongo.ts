import { Document, InsertOneResult, MongoClient } from "mongodb";
import { mongoOptions } from "../constants/globals";
import { ISession } from "../models/ISession";

async function removeItem(idVal:number, coll:string):Promise<void>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(mongoOptions.uri)
        .then(async(connection: MongoClient) =>
        {
            client = connection;
            await client.db(mongoOptions.db).collection(coll).deleteOne({
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

async function saveTable(dataArray: any, coll:string): Promise<void>
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
            await client.db(mongoOptions.db).collection(coll).updateOne(
                {
                    id: descriptorID ? descriptorID.value : i
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

async function theSaveData(coll:string): Promise<any[]>
{
    let client: MongoClient | null = null;
	
    try
    {
        client = await MongoClient.connect(mongoOptions.uri);
        const x = await client.db(mongoOptions.db).collection(coll).find({
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

export { removeItem, saveTable, theSaveData };
