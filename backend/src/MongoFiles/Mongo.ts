import { Document, InsertOneResult, MongoClient } from "mongodb";
import { mongoOptions } from "../constants/globals";
import { ISession } from "../models/ISession";

// Ignore this dirty typing. It's just for these examples.
type genericObject = { [key: string]: number | string | null };

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

export { genericObject, saveTable, getAllSessions };
