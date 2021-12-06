import { MongoClient } from "mongodb";
import { mongoOptions } from "../constants/globals";
import { userFromKey } from "./MongoLogin";
import { MyCrypto } from "../Encryption/MyCrypto";
import { BE_KEY } from "../constants/globals";

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

async function saveTable(dataArray: any, FE_KEY:string, key:string, coll:string): Promise<void>
{
    let client: MongoClient | null = null;
    try
    {
        client = await MongoClient.connect(mongoOptions.uri);
        const uname = await userFromKey(key);
        if (!uname || uname === "")
        {
            return;
        }
        for (let i = 0; i < dataArray.length; i++)
        {
            const myCrypt = MyCrypto.getInstance();
            const theUserKey = myCrypt.decryptMultKeys(key, [FE_KEY, BE_KEY]);
            const valsToInsert = {
            };
            for (const [key, value] of Object.entries(dataArray[i]))
            {
                const theKey = key;
                let theValue = value;
                if (theKey !== 'id' && theKey !== '_id')
                {
                    theValue = myCrypt.encryption(theValue as string, theUserKey);
                }
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

async function theSaveData(FE_KEY:string, key:string, coll:string): Promise<any[]>
{
    let client: MongoClient | null = null;
	
    try
    {
        client = await MongoClient.connect(mongoOptions.uri);
        const uname = await userFromKey(key);
        if (!uname || uname === "")
        {
            return [];
        }
        const x = await client.db(mongoOptions.db).collection(`${uname  }_${  coll}`).find({
        }).toArray();
        const myCrypt = MyCrypto.getInstance();
        const theUserKey = myCrypt.decryptMultKeys(key, [FE_KEY, BE_KEY]);
        for (let i = 0; i < x.length; i++)
        {
            for (const [key, value] of Object.entries(x[i]))
            {
                const theKey = key;
                let theValue = value;
                if (theKey !== 'id' && theKey !== '_id')
                {
                    theValue = myCrypt.decryption(theValue as string, theUserKey);
                    x[i][`${theKey}`] = theValue;
                }
            }
        }
        return x;
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
    }
}

export { removeItem, saveTable, theSaveData };
