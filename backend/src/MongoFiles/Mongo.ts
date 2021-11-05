import { InsertOneResult, MongoClient } from "mongodb";
import { mongoOptions } from "../constants/globals";

/**
	Temp Function to remove item from db_kevin.stock_data
	Will be updated in the future or removed if need be
	
	Function removes an item from stock_data based on
	id:number in collection stock_data
	(not _id:ObjectId)
**/
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

/**
	If data id already exists in db, it updates value in db
	Otherwise, updateOne has the capacity to InsertOne
**/

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

export { removeItem, saveTable, theSaveData };
