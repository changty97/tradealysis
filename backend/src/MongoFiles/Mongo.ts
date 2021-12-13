import { MongoClient } from "mongodb";
import { mongoOptions } from "../constants/globals";
import { userFromKey } from "./MongoLogin";

/**
	Remove item From Session Page
	@param {number} idVal: id
	@param {string} coll: collection to remove item
**/
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

/**
	Save Data to a collection
	@param {any} dataArray: array from SheetComponent.tsx
	@param {string} key: userKey
	@param {string} collection to save data (session name)
	
	For user admin for example, data is saved to admin_myData if @param coll = myData
**/
async function saveTable(dataArray: any, key:string, coll:string): Promise<void>
{
    let client: MongoClient | null = null;
    try
    {
        client = await MongoClient.connect(mongoOptions.uri);
        const uname = await userFromKey(key);
        if (!uname || uname === "")
        {
            throw new Error("Saving Data: Invalid User Error");
        }
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
            await client.db(mongoOptions.db).collection(`${uname  }_${  coll}`).updateOne(
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

/**
	Get Data from a collection
	@param {string} key: userKey
	@param {string} coll: session name
	@throws {Error} if key is invalid or does not correspond to user
	
	Actual Collection is derived from username followed by underscore followed by @param coll
	For admin, it would be: admin_myData if @param coll=myData
	
	All items are fetched to be displayed on SheetComponent on Frontend
**/
async function theSaveData(key:string, coll:string): Promise<any[]>
{
    let client: MongoClient | null = null;
	
    try
    {
        client = await MongoClient.connect(mongoOptions.uri);
        const uname = await userFromKey(key);
        if (!uname || uname === "")
        {
            throw new Error("Loading Data: Invalid User Error");
        }
        const x = await client.db(mongoOptions.db).collection(`${uname  }_${  coll}`).find({
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
