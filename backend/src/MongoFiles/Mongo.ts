import { InsertOneResult, MongoClient } from "mongodb";
import { mongoOptions } from "../constants/globals";
import { parsedData } from "../models/IStockData";
import axios from "axios";

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

function retreiveYahooData(ticker: string): Promise<string>
{
    return axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?lang=en-US&region=US&corsDomain=finance.yahoo.com&symbols=${ticker}`)
        .then(function(response: { data: any; })
        {
            const data = response.data.quoteResponse.result[0];
            Object.entries(data).map(([key, value]) =>
            {
                switch (`${key}`)
                {
                case "longName": parsedData.longName = `${value}`; break;
                case "regularMarketPrice": parsedData.regularMarketPrice = `${value}`; break;
                case "fiftyTwoWeekHigh": parsedData.fiftyTwoWeekHigh = `${value}`; break;
                case "fiftyTwoWeekLow": parsedData.fiftyTwoWeekLow = `${value}`; break;
                case "averageDailyVolume3Month": parsedData.averageDailyVolume3Month = `${value}`; break;
                case "sharesOutstanding": parsedData.sharesOutstanding = `${value}`; break;
                case "regularMarketVolume": parsedData.regularMarketVolume = `${value}`; break;
                case "regularMarketOpen": parsedData.regularMarketOpen = `${value}`; break;
                case "regularMarketDayHigh": parsedData.regularMarketDayHigh = `${value}`; break;
                default: break;
                }
            });

            return retreiveFloatYahooData(ticker);
        })
        .catch(function(error: any)
        {
            return Promise.reject(error);
        });
}

function retreiveFloatYahooData(ticker: string): Promise<string>
{
    return axios.get(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=defaultKeyStatistics`)
        .then(function(response: { data: any; })
        {
            const data = response.data.quoteSummary.result[0].defaultKeyStatistics.shortPercentOfFloat;
            Object.entries(data).map(([key, value]) =>
            {
                if (`${key}` === "fmt")
                {
                    parsedData.shortPercentOfFloat = `${value}`;
                }
            });

            return JSON.stringify(parsedData);
        })
        .catch(function(error: any)
        {
            return Promise.reject(error);
        });
}


export { exampleInsertThing, exampleRetrieveThing, genericObject, saveTable, retreiveYahooData  };
