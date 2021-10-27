import { InsertOneResult, MongoClient } from "mongodb";
import { mongoOptions } from "../constants/globals";

// Ignore this dirty typing. It's just for these examples.
type genericObject = { [key: string]: number | string | null };

function exampleInsertThing(thing: number): Promise<string>
{
    let client: MongoClient | null = null;

    return MongoClient.connect(mongoOptions.uri)
        .then((connection: MongoClient) =>
        {
            client = connection;

            return client.db(mongoOptions.db)
                .collection(mongoOptions.collection)
                .insertOne({
                    "test": thing
                });
        })
        .then((result: InsertOneResult<genericObject>) =>
        {
            return result.insertedId.toString();
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

function exampleRetrieveThing(queryObject: genericObject): Promise<genericObject[]>
{
    let client: MongoClient | null = null;

    return MongoClient.connect(mongoOptions.uri)
        .then((connection: MongoClient) =>
        {
            client = connection;

            return client.db(mongoOptions.db)
                .collection(mongoOptions.collection)
                .find(queryObject).toArray();
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

function saveTable(dataArray: any): Promise<string>
{
    let client: MongoClient | null = null;

    return MongoClient.connect(mongoOptions.uri)
        .then((connection: MongoClient) =>
        {
            client = connection;
            return client.db(mongoOptions.db)
                .collection(mongoOptions.collection)
                .insertOne({
                    "table_data": dataArray
                });
        })
        .then((result: InsertOneResult<genericObject>) =>
        {
            return result.insertedId.toString();
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

export { exampleInsertThing, exampleRetrieveThing, genericObject, saveTable };
