import axios from "axios";

const finnhub_api_key = process.env.FINNHUB_API_KEY;
const AlphaVantage_api_key = process.env.AlphaVantage_API_KEY;

async function getStockData(ID: string): Promise<any>
{
    // Store the stock symbol
    const StockSymbol = ID.toUpperCase();

    //Company Overview API URL provided by Alpha Vantage.
    //This API returns the company information, financial ratios, and other key metrics for the equity specified.
    //Data is generally refreshed on the same day a company reports its latest earnings and financials.
    const overviewurl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${StockSymbol}&apikey=${AlphaVantage_api_key}`;

    // Define varibles to store fetched data
    const Ticker = StockSymbol;       //Symbol
    let Industry;     //Industry
    let Exchange;     //Exchange
    let Price;        //Current price
    let W52H;         //Highest price within 52 weeks
    let L52H;         //Lowest price within 52 weeks
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

    //Fetch data from Alpha Vantage API
    await axios(overviewurl)
        .then(response =>
        {
            const query = response.data;
            Industry = query['Industry'];                  //Industry
            Exchange = query['Exchange'];                  //Exchange
            W52H = query['52WeekHigh'];                    //Highest price within 52 weeks
            L52H = query['52WeekLow'];                     //Lowest price within 52 weeks
            Outstanding = query['SharesOutstanding'];      //Outstanding shares
            Float = query['SharesFloat'];                  //Float
        })
        .catch(console.error);

    //Fetch current price from Finnhub API data
    const urlcurrent = `https://finnhub.io/api/v1/quote?symbol=${StockSymbol}&token=${finnhub_api_key}`;
    await axios(urlcurrent)
        .then(response =>
        {
            const query = response.data;
            Open = query['o'];          //Open price
            HOD = query['h'];           //High of the day
            LOD = query['l'];           //Low of the day
            Price = query['c'];         //Current price
            PC = query['pc'];           //previous close price
        })
        .catch(console.error);

    //convert regular time to Unix timestamp which is used in Finnhub API data
    function timestamp(hour: number, minute: number)
    {
        const date = new Date();
        date.setHours(hour, minute, 0, 0);
        //date.setDate(22);
        const timestampvalue = date.getTime() / 1000;
        return timestampvalue;
    }
  

    //convert premarket time 1:00 and 6:29 to Unix timestamp
    FromTimestamp = timestamp(1, 0);
    ToTimestamp = timestamp(6, 29);
    Interval = 1;
  

    //Fetch Premarket volume and Pre-market high price from Finnhub premarket data
    const urlpremarket = `https://finnhub.io/api/v1/quote?symbol=${StockSymbol}&token=${finnhub_api_key}`;
    await axios(urlpremarket)
        .then(response =>
        {
            const query = response.data;
            VolPreM = volumsum();
            PremHigh = Math.max(...query.h);
  
            function volumsum()
            {
                let sum = 0;
                for (let i = 0; i < (query.v.length); i++)
                {
                    sum += query.v[i];
                }
                return sum;
            }
  
        })
        .catch(console.error);

    //convert regular market time 9:30 and 13:00 to Unix timestamp
    FromTimestamp = timestamp(9, 30);
    ToTimestamp = timestamp(13, 0);
    Interval = 1;

    //Fetch HOD time and LOD time from Finnhub intraday data
    const urlintraday = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=${Interval}&from=${FromTimestamp}&to=${ToTimestamp}&token=${finnhub_api_key}`;
    await axios(urlintraday)
        .then(response =>
        {
            const query = response.data;
            HODTime = findhightime();
            LODTime = findlowtime();
     
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

    //convert current time to Unix timestamp
    const date = new Date();
    date.setHours(17, 0, 0, 0);
    //date.setDate(22);
    ToTimestamp = date.getTime() / 1000;
    FromTimestamp = timestamp(13, 1);
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
    
    //Create a Json object to store the returned data
    const apidata = {
        Ticker: Ticker,            //Symbol
        Industry: Industry,        //Industry
        Exchange: Exchange,        //Exchange
        Price: Price,              //Current price
        W52H: W52H,                //Highest price within 52 weeks
        L52H: L52H,                //Lowest price within 52 weeks
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
