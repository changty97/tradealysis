import { InsertOneResult, MongoClient } from "mongodb";
import { mongoOptionsLogin } from "./constants/globals";
import * as mongoDB from "mongodb";

/** Returns 1 on success, 0 on failure **/
async function correctLogin(username:string, password:string): Promise<number>
{
    let client: MongoClient | null = null;
    return MongoClient.connect(mongoOptionsLogin.uri).then((connection: MongoClient) =>
    {
        client = connection;
        const db: mongoDB.Db = client.db(mongoOptionsLogin.db);
        const theCollection: mongoDB.Collection = db.collection(mongoOptionsLogin.collection);
        const x = (theCollection.find(
            {
                "uname": username,
                "pssd": password,
            }).count());
        return x;
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

export { correctLogin };

