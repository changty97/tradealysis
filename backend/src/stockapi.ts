import axios from "axios";

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

function printFetch(symbol:string, realtime:string)
{
    const currentDate = new Date();
    const date = (`0${  currentDate.getDate()}`).slice(-2);
    const month = (`0${  currentDate.getMonth() + 1}`).slice(-2);
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    if (realtime == "y")
    {
        console.log(`Successfully fetched ${symbol } realtime data at ${year  }-${  month  }-${  date  } ${  hours  }:${  minutes  }:${  seconds}`);
    }
    else
    {
        console.log(`Successfully fetched ${symbol} historical data at ${year  }-${  month  }-${  date  } ${  hours  }:${  minutes  }:${  seconds}`);
    }
    
}

async function getStockData(ID: string): Promise<any>
{

    const firstCharacter = ID.substring(0, 1);
    const currentdate = new Date();

    // Define varibles to store fetched data
    let Ticker;      //Symbol
    let Industry;     //Industry
    let Exchange;     //Exchange
    let Price;        //Current price
    let W52H;         //Highest price within 52 weeks
    let W52L;         //Lowest price within 52 weeks
    let VolAvg;       //To be confirmed
    let Outstanding;  //Outstanding shares
    let Float;        //Float shares
    let VolDOI;       //To be confirmed
    let VolPreM;      //Premarket volume
    let PC;           //previous close price
    let PremHigh;      //Pre-market high price
    let Open;          //Open price
    let HOD;            //High of the day
    let HODTime;        //HOD time
    let LOD;            //Low of the day
    let LODTime;        //LOD time
    let Close;          //To be confirmed
    let AH;             //The price after hours
    let FromTimestamp;   //Starting timestamp of speficifed time range
    let ToTimestamp;     //Ending timestamp of speficifed time range
    let Interval;        //Time interval between two consecutive data points in the time series.

    if ( firstCharacter == "2" )
    {
        // Store the stock symbol
        const StockSymbol = ID.substring(11).toUpperCase();
        Ticker = StockSymbol;
        // Store the speficied year, month, and day input in ID with format "YYYY-MM-DD-StockSymbol"
        const yy = Number(ID.substring(0, 4));
        const mm = Number(ID.substring(5, 7));
        const dd = Number(ID.substring(8, 10));
        const specifiedDate = ID.substring(0, 10);

        //Company Overview API URL provided by Alpha Vantage.
        //This API returns the company information, financial ratios, and other key metrics for the equity specified.
        //Data is generally refreshed on the same day a company reports its latest earnings and financials.
        const overviewurl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${StockSymbol}&apikey=${AlphaVantage_api_key}`;

        //Fetch fundamental data from Alpha Vantage API
        await axios(overviewurl)
            .then(response =>
            {
                const query = response.data;
                Industry = query['Industry'];                  //Industry
                Exchange = query['Exchange'];                  //Exchange
                //W52H = query['52WeekHigh'];                    //Highest price within 52 weeks
                //W52L = query['52WeekLow'];                     //Lowest price within 52 weeks
                Outstanding = query['SharesOutstanding'];      //Outstanding shares
                Float = query['SharesFloat'];                  //Float
            })
            .catch(console.error);

        //This API returns raw (as-traded) daily open/high/low/close/volume values, daily adjusted close values,
        //and historical split/dividend events of the global equity specified, covering 20+ years of historical data.
        const dailyurl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${StockSymbol}&outputsize=compact&apikey=${AlphaVantage_api_key}`;
    
        /*
    //Fetch quotes from Alpha Vantage API on the specified date
    await axios(dailyurl)
        .then(response =>
        {
            const query = response.data;
            Open = query["Time Series (Daily)"][specifiedDate]["1. open"];             //Open Price of the specified date
            HOD =  query["Time Series (Daily)"][specifiedDate]["2. high"];             //Highest price of the specified date
            LOD =  query["Time Series (Daily)"][specifiedDate]["3. low"];              //Lowest price of the specified date
            Close =  query["Time Series (Daily)"][specifiedDate]["4. close"];          //Close price of the specified date
            VolDOI =  query["Time Series (Daily)"][specifiedDate]["6. volume"];        //Volume of the specified date
        })
        .catch(console.error);
    */

        //Fetch current price from Finnhub API data
        const urlcurrent = `https://finnhub.io/api/v1/quote?symbol=${StockSymbol}&token=${finnhub_api_key}`;
        await axios(urlcurrent)
            .then(response =>
            {
                const query = response.data;
                Price = query['c'];         //Current price
            })
            .catch(console.error);
  

        //convert premarket time 1:00 and 6:29 of specified date to Unix timestamp
        //In order to fetch Premarket volume and Pre-market high price from Finnhub premarket data
        FromTimestamp = timestamp(yy, mm, dd, 1, 0);
        ToTimestamp = timestamp(yy, mm, dd, 6, 29);
        Interval = 1;
  

        //Fetch Premarket volume and Pre-market high price from Finnhub premarket data
        const urlpremarket = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=${Interval}&from=${FromTimestamp}&to=${ToTimestamp}&token=${finnhub_api_key}`;
        await axios(urlpremarket)
            .then(response =>
            {
                const query = response.data;
                VolPreM = volumsum();
                PremHigh = Math.max(...query.h);
  
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

        //convert regular market time 6:30 and 13:00 of specified date to Unix timestamp
        //In order to fetch Open, HOD, LOD, Close, VolDOI, HOD time, and LOD time from Finnhub intraday data on the specified date
        FromTimestamp = timestamp(yy, mm, dd, 6, 30);
        ToTimestamp = timestamp(yy, mm, dd, 13, 0);
        Interval = 1;

        //Fetch Open, HOD, LOD, Close, VolDOI, HOD time, and LOD time from Finnhub intraday data on the specified date
        const urlintraday = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=${Interval}&from=${FromTimestamp}&to=${ToTimestamp}&token=${finnhub_api_key}`;
        await axios(urlintraday)
            .then(response =>
            {
                const query = response.data;
                Open = query.o[0];
                HOD = Math.max(...query.h);
                LOD = Math.min(...query.l);
                Close = query.c[query.c.length - 1];
                VolDOI = volumesum();
                HODTime = findhightime();
                LODTime = findlowtime();

                //Caculate the volume
                function volumesum()
                {
                    let sum = 0;
                    for (let i = 0; i < ((query.v).length); i++)
                    {
                        sum += query.v[i];
                    }
                    return sum;
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
        Interval = 1;
   
        //Fetch after hour price from Finnhub
        const urlafterhour = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=${Interval}&from=${FromTimestamp}&to=${ToTimestamp}&token=${finnhub_api_key}`;
        await axios(urlafterhour)
            .then(response =>
            {
                const query = response.data;
                AH = query.c[(query.c.length - 1)];
            })
            .catch(console.error);

        //convert intraday time of previous day before the specified date to Unix timestamp
        //In order to fetch previous close price from Finnhub
        FromTimestamp = timestamp(yy, mm, dd - 1, 13, 0);
        ToTimestamp = timestamp(yy, mm, dd - 1, 13, 0);
        Interval = 'D';

     
        //Fetch previous close price from Finnhub
        const urldaily = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=D&from=${FromTimestamp}&to=${ToTimestamp}&token=${finnhub_api_key}`;
        await axios(urldaily)
            .then(response =>
            {
                const query = response.data;
                PC = Number(query.c);
            })
            .catch(console.error);

        //convert intraday time to Unix timestamp on current date
        //In order to fetch VolAvg from Finnhub intraday data on the current date
        const currentdate = new Date();

        FromTimestamp = timestamp(currentdate.getFullYear(),
            currentdate.getMonth() + 1,
            currentdate.getDate(), 6, 30);

        ToTimestamp = timestamp(currentdate.getFullYear(),
            currentdate.getMonth() + 1,
            currentdate.getDate(),
            currentdate.getHours(),
            currentdate.getMinutes());

        Interval = 1;

        //Fetch VolAvg from Finnhub intraday data on the current date
        const urlCurrentIntraday = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=${Interval}&from=${FromTimestamp}&to=${ToTimestamp}&token=${finnhub_api_key}`;
        await axios(urlCurrentIntraday)
            .then(response =>
            {
                const query = response.data;
                VolAvg = volumesum();

                //Caculate the volume
                function volumesum()
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

        //convert 52 weeks time range to Unix timestamp
        //In order to fetch highest price and lowest price in the past 52 weeks from Finnhub API
        FromTimestamp = timestamp(currentdate.getFullYear() - 1,
            currentdate.getMonth() + 1,
            currentdate.getDate(), 6, 30);

        ToTimestamp = timestamp(currentdate.getFullYear(),
            currentdate.getMonth() + 1,
            currentdate.getDate(),
            currentdate.getHours(),
            currentdate.getMinutes());

        Interval = 'D';

        //Fetch highest price and lowest price in the past 52 weeks from Finnhub API
        const url52W = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=${Interval}&from=${FromTimestamp}&to=${ToTimestamp}&token=${finnhub_api_key}`;
        await axios(url52W)
            .then(response =>
            {
                const query = response.data;
                W52H = Math.max(...query.h);
                W52L = Math.min(...query.l);

 
            })
            .catch(console.error);

        printFetch(StockSymbol, "y");
    }
    else
    {
        // Store the stock symbol
        const StockSymbol = ID.toUpperCase();
        Ticker = StockSymbol;
        //Fetch current price from Finnhub API data
        const urlcurrent = `https://finnhub.io/api/v1/quote?symbol=${StockSymbol}&token=${finnhub_api_key}`;
        await axios(urlcurrent)
            .then(response =>
            {
                const query = response.data;
                Price = query['c'];         //Current price
            })
            .catch(console.error);
  
        //convert 52 weeks time range to Unix timestamp
        FromTimestamp = timestamp(currentdate.getFullYear() - 1,
            currentdate.getMonth() + 1,
            currentdate.getDate(), 6, 30);

        ToTimestamp = timestamp(currentdate.getFullYear(),
            currentdate.getMonth() + 1,
            currentdate.getDate(),
            currentdate.getHours(),
            currentdate.getMinutes());

        Interval = 'D';


        //Fetch highest price and lowest price in the past 52 weeks from Finnhub API
        const url52W = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=${Interval}&from=${FromTimestamp}&to=${ToTimestamp}&token=${finnhub_api_key}`;
        await axios(url52W)
            .then(response =>
            {
                const query = response.data;
                W52H = Math.max(...query.h);
                W52L = Math.min(...query.l);


            })
            .catch(console.error);

        //convert intraday time to Unix timestamp on current date
        //In order to fetch VolAvg from Finnhub intraday data on the current date
        //const currentdate = new Date();

        FromTimestamp = timestamp(currentdate.getFullYear(),
            currentdate.getMonth() + 1,
            currentdate.getDate(), 6, 30);

        ToTimestamp = timestamp(currentdate.getFullYear(),
            currentdate.getMonth() + 1,
            currentdate.getDate(),
            currentdate.getHours(),
            currentdate.getMinutes());

        Interval = 1;

        //Fetch VolAvg from Finnhub intraday data on the current date
        const urlCurrentIntraday = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=${Interval}&from=${FromTimestamp}&to=${ToTimestamp}&token=${finnhub_api_key}`;
        await axios(urlCurrentIntraday)
            .then(response =>
            {
                const query = response.data;
                VolAvg = volumesum();

                //Caculate the volume
                function volumesum()
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

        printFetch(StockSymbol, "n");
    }

    //Create a Json object to store the returned data
    const apidata = {
        Ticker: Ticker,            //Symbol
        Industry: Industry,        //Industry
        Exchange: Exchange,        //Exchange
        Price: Price,              //Current price
        W52H: W52H,                //Highest price within 52 weeks
        W52L: W52L,                //Lowest price within 52 weeks
        VolAvg: VolAvg,            //To be confirmed
        Outstanding: Outstanding,  //Outstanding shares
        Float: Float,              //Float shares
        VolDOI: VolDOI,            //To be confirmed
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

export { getStockData };
