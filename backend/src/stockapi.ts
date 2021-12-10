import axios from "axios";
import { IStockData } from "./models/IStockData";

/* Harry's API stuff */

const finnhub_api_key = process.env.FINNHUB_API_KEY;
const AlphaVantage_api_key = process.env.AlphaVantage_API_KEY;

//convert regular time of specified date to Unix timestamp which is used in Finnhub API data
function timestamp(year: number, month: number, day: number, hour: number, minute: number)
{
    const date = new Date();
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);
    date.setHours(hour, minute, 0, 0);
    const timestampvalue = date.getTime() / 1000;
    return timestampvalue;
}

function printFetch(symbol:string, yy:number, mm:number, dd:number)
{
    const currentDate = new Date();
    const date = (`0${  currentDate.getDate()}`).slice(-2);
    const month = (`0${  currentDate.getMonth() + 1}`).slice(-2);
    const year = currentDate.getFullYear();
    const hours = (`0${  currentDate.getHours()}`).slice(-2);
    const minutes = (`0${  currentDate.getMinutes()}`).slice(-2);
    const seconds = (`0${  currentDate.getSeconds()}`).slice(-2);
    console.log(`Fetched ${symbol} ${yy}-${mm}-${dd} data at ${year  }-${  month  }-${  date  } ${  hours  }:${  minutes  }:${  seconds}`);
}

async function getStockData(dateAndTicker: string): Promise<any>
{
    
    const currentdate = new Date();

    // Parse the dateAndTicker string with format of "YYYY-MM-DD-StockSymbol"
    const DateTickerString:string[] = dateAndTicker.split("-");
    const yy = Number(DateTickerString[0]);
    const mm = Number(DateTickerString[1]);
    const dd = Number(DateTickerString[2]);
    const StockSymbol = DateTickerString[3].toUpperCase();

    // Define varibles to store fetched
    const Ticker = StockSymbol;     //Symbol
    let Industry:string;            //Industry
    let Exchange:string;            //Exchange
    let Price:number;               //Current price
    let W52H:number;                //Highest price within 52 weeks
    let W52L:number;                //Lowest price within 52 weeks
    let VolAvg:number;              //Realtime volume
    let Outstanding:number;         //Outstanding shares
    let VolDOI:number;              //Volume on the specified transaction date
    let VolPreM:number;             //Premarket volume
    let PC:number;                  //previous close price on the specified transaction date
    let PremHigh:number;            //Pre-market high price on the specified transaction date
    let Open:number;                //Open price on the specified transaction date
    let HOD:number;                 //Highest price on the specified transaction date
    let HODTime:string;             //HOD time
    let LOD:number;                 //Lowest price on the specified transaction date
    let LODTime:string;             //LOD time
    let Close:number;               //Close price on the specified transaction date
    let AH:number;                  //The price after hours on the specified transaction date
    let FromTimestamp:number;       //Starting timestamp of speficifed time range
    let ToTimestamp:number;         //Ending timestamp of speficifed time range
    let Interval:string;            //Time interval between two consecutive data points in the time series.

    //Company Overview API URL provided by Alpha Vantage.
    //This API returns the company information, financial ratios, and other key metrics for the equity specified.
    //Data is generally refreshed on the same day a company reports its latest earnings and financials.
    const overviewurl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${StockSymbol}&apikey=${AlphaVantage_api_key}`;

    //Fetch fundamental data from Alpha Vantage API
    await axios(overviewurl)
        .then(AxiosResponse =>
        {
            const query = AxiosResponse.data;
            Industry = query['Industry'];                  //Industry
            Exchange = query['Exchange'];                  //Exchange
            Outstanding = parseInt(query['SharesOutstanding']);      //Outstanding shares
        })
        .catch(console.error);
    
    //Fetch current price from Finnhub API data
    const urlcurrent = `https://finnhub.io/api/v1/quote?symbol=${StockSymbol}&token=${finnhub_api_key}`;
    await axios(urlcurrent)
        .then(AxiosResponse =>
        {
            const query = AxiosResponse.data;
            Price = query['c'];         //Current price
        })
        .catch(console.error);
  
    //convert premarket time 1:00 and 6:29 of specified date to Unix timestamp
    //In order to fetch Premarket volume and Pre-market high price from Finnhub premarket data
    FromTimestamp = timestamp(yy, mm, dd, 1, 0);
    ToTimestamp = timestamp(yy, mm, dd, 6, 29);
    Interval = "1";
  
    //Fetch Premarket volume and Pre-market high price from Finnhub premarket data
    const urlpremarket = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=${Interval}&from=${FromTimestamp}&to=${ToTimestamp}&token=${finnhub_api_key}`;
    await axios(urlpremarket)
        .then(AxiosResponse =>
        {
            const query = AxiosResponse.data;
            if (query.s == 'ok')
            {
                VolPreM = volumsum();
                PremHigh = Math.max(...query.h);
            }
            else
            {
                console.log(`Failed to fetch VolPrem and PremHigh because there is no data on ${yy}-${mm}-${dd}`);
            }
  
            function volumsum()
            {
                let sum = 0;
                for (let i = 0; i < ((query.v).length); i++)
                {
                    sum += query.v[i];
                }
                return sum;
            }
  
        })
        .catch(console.error);
    

    //convert specified date to Unix timestamp
    //In order to fetch VolDOI, open price, close price, and previous close price on the specified date
    FromTimestamp = timestamp(yy, mm, dd - 4, 6, 30);
    ToTimestamp = timestamp(yy, mm, dd, 13, 0);
    Interval = 'D';

    //Fetch VolDOI, open price, close price, and previous close price from Finnhub
    const urlvolDOI = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=${Interval}&from=${FromTimestamp}&to=${ToTimestamp}&token=${finnhub_api_key}`;
    await axios(urlvolDOI)
        .then(AxiosResponse =>
        {
            const query = AxiosResponse.data;
            if (query.s == 'ok')
            {
                const length = query.t.length;
                VolDOI = Number(query.v[length - 1]);
                Open = query.o[length - 1];
                Close = query.c[length - 1];
                PC = query.c[length - 2];
            }
            else
            {
                console.log(`Failed to fetch VolDOI, Open, Close, and PC because there is no data on ${yy}-${mm}-${dd}`);
            }
        })
        .catch(console.error);
    
    //convert regular market time 6:30 and 13:00 of specified date to Unix timestamp
    //In order to fetch Open, HOD, LOD, HOD time, and LOD time from Finnhub intraday data on the specified date
    FromTimestamp = timestamp(yy, mm, dd, 6, 30);
    ToTimestamp = timestamp(yy, mm, dd, 13, 0);
    Interval = "1";

    //Fetch Open, HOD, LOD, HOD time, and LOD time from Finnhub intraday data on the specified date
    const urlintraday = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=${Interval}&from=${FromTimestamp}&to=${ToTimestamp}&token=${finnhub_api_key}`;
    await axios(urlintraday)
        .then(AxiosResponse =>
        {
            const query = AxiosResponse.data;
            if (query.s == 'ok')
            {
                HOD = Math.max(...query.h);
                LOD = Math.min(...query.l);
                HODTime = findhightime();
                LODTime = findlowtime();
            }
            else
            {
                console.log(`Failed to fetch HOD, LOD, HODTime, and LODTime because there is no data on ${yy}-${mm}-${dd}`);
            }
            //find the time of highest price
            function findhightime()
            {
                const max = Math.max(...query.h);
                let hightime;
                for (let i = 0; i < (query.h.length); i++)
                {
                    if (query.h[i] == max)
                    {
                        hightime = query.t[i];
                    }
                }
                hightime = converttime(hightime);
                return hightime;
            }
  
            //find the time of lowest price
            function findlowtime()
            {
                let lowtime;
                const min = Math.min(...query.l);
                for (let i = 0; i < (query.l.length); i++)
                {
                    if (query.l[i] == min)
                    {
                        lowtime = query.t[i];
                    }
                }
                lowtime = converttime(lowtime);
                return lowtime;
            }

            //convert Unix timestamp to regular time
            function converttime(time: number)
            {
                const date = new Date(time * 1000);
                const hours = date.getHours();
                const minutes = `0${  date.getMinutes()}`;
                const displayTime = `${hours  }:${  minutes.substr(-2)}`;
                return displayTime;
            }
        })
        .catch(console.error);

    //convert after hour time on specified date to Unix timestamp
    //In order to fetch after hour price from Finnhub
    FromTimestamp = timestamp(yy, mm, dd, 13, 1);
    ToTimestamp = timestamp(yy, mm, dd, 17, 0);
    Interval = "1";
   
    //Fetch after hour price from Finnhub
    const urlafterhour = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=${Interval}&from=${FromTimestamp}&to=${ToTimestamp}&token=${finnhub_api_key}`;
    await axios(urlafterhour)
        .then(AxiosResponse =>
        {
            const query = AxiosResponse.data;
            if (query.s == 'ok')
            {
                AH = query.c[(query.c.length - 1)];
            }
            else
            {
                console.log(`Failed to fetch AH because there is no data on ${yy}-${mm}-${dd}`);
            }
        })
        .catch(console.error);
   
    printFetch(StockSymbol, yy, mm, dd);
    
    //Create a Json object to store the returned data
    const apidata: IStockData = {
        Ticker: Ticker,            //Symbol
        Industry: Industry,        //Industry
        Exchange: Exchange,        //Exchange
        Price: Price,              //Current price
        VolDOI: VolDOI,            //Volume on the day of interest
        VolPreM: VolPreM,          //Premarket volume
        PC: PC,                    //previous close price
        PremHigh: PremHigh,        //Pre-market high price
        Open: Open,                //Open price
        HOD: HOD,                  //High of the day
        HODTime: HODTime,          //HOD time
        LOD: LOD,                  //Low of the day
        LODTime: LODTime,          //LOD time
        Close: Close,              //To be confirmed
        AH: AH,                    //The price after hours
    };

    return apidata;

}

/* Tyler's API stuff */

function retrieveYahooData(ticker: string): Promise<IStockData>
{
    const stockData: IStockData = {
    };

    return axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?lang=en-US&region=US&corsDomain=finance.yahoo.com&symbols=${ticker}`)
        .then((response) =>
        {
            const data = response.data.quoteResponse.result[0];
            Object.entries(data).map(([key, value]: [string, string]) =>
            {
                switch (`${key}`)
                {
                case "longName":
                    stockData.LongName = `${value}`;
                    break;
                case "regularMarketPrice":
                    stockData.Price = parseFloat(value);
                    break;
                case "fiftyTwoWeekHigh":
                    stockData.W52H = parseFloat(value);
                    break;
                case "fiftyTwoWeekLow":
                    stockData.W52L = parseFloat(value);
                    break;
                case "averageDailyVolume3Month":
                    stockData.VolAvg = parseInt(value);
                    break;
                case "sharesOutstanding":
                    stockData.Outstanding = parseInt(value);
                    break;
                case "regularMarketVolume":
                    stockData.VolDOI = parseInt(value);
                    break;
			
                case "regularMarketOpen":
                    stockData.Open = parseFloat(value);
                    break;
				
                case "regularMarketDayHigh":
                    stockData.HOD = parseFloat(value);
                    break;
                default: break;
                }
            });

            return retrieveFloatYahooData(ticker);
        })
        .then((response: number) =>
        {
            stockData.Float = response;

            return stockData;
        })
        .catch(function(error: any)
        {
            return Promise.reject(error);
        });
}

function retrieveFloatYahooData(ticker: string): Promise<number>
{
    return axios.get(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=defaultKeyStatistics`)
        .then((response) =>
        {
            const data = response.data.quoteSummary.result[0].defaultKeyStatistics.floatShares;
            let floatShares: number;
            Object.entries(data).map(([key, value]: [string, string]) =>
            {
                if (`${key}` === "raw") // I'm choosing "raw" instead of "fmt" because Harry's API requests give the raw number.
                {
                    floatShares = parseInt(value);
                }
            });

            return floatShares;
        })
        .catch(function(error: any)
        {
            return Promise.reject(error);
        });
}

export { getStockData, retrieveYahooData };
