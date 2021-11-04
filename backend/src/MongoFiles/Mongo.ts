import { InsertOneResult, MongoClient } from "mongodb";
import { mongoOptions } from "../constants/globals";

// Ignore this dirty typing. It's just for these examples.
type genericObject = { [key: string]: number | string | null };

async function saveTable(dataArray: any): Promise<void>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(mongoOptions.uri)
        .then(async(connection: MongoClient) =>
        {
            client = connection;
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
                await client.db(mongoOptions.db).collection(mongoOptions.collection).insertOne(valsToInsert);
            }
        })
        .then(() =>
        {
            return;
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

async function theSaveData(): Promise<any[]>
{
    let client: MongoClient | null = null;
	
    return MongoClient.connect(mongoOptions.uri)
        .then(async(connection: MongoClient) =>
        {
            client = connection;
            return await client.db(mongoOptions.db).collection(mongoOptions.collection)
                .find({
                }).toArray();
	
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
async function getTableData(objId: string): Promise<any>
{
    let tableData: Promise<any>;
    let client: MongoClient | null = null;
    return MongoClient.connect(mongoOptions.uri)
        .then((connection: MongoClient) =>
        {
            client = connection;
            tableData = client.db(mongoOptions.db)
                .collection(mongoOptions.collection)
                .find({
                    "_id": new ObjectId(objId)
                }).toArray();
        })
        .then((result) =>
        {
            return tableData;
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


**/

export { genericObject, saveTable, theSaveData };
