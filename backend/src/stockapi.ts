const axios = require('axios');
const finnhub = require('finnhub'); //Fetch real-time quote data from Finnhub API
var rp = require('request-promise');

async function getStockData(ID: string): Promise<any> {
  // Store the stock symbol
  var StockSymbol=ID.toUpperCase();

  //Company Overview API URL provided by Alpha Vantage.
  //This API returns the company information, financial ratios, and other key metrics for the equity specified. 
  //Data is generally refreshed on the same day a company reports its latest earnings and financials.
  let overviewurl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${StockSymbol}&apikey=${API_KEY}`;

  // Define varibles to store fetched data
  var Triker;       //Symbol
  var Industry;     //Industry
  var Exchange;     //Exchange
  var Price;        //Current price
  var W52H;         //Highest price within 52 weeks
  var L52H;         //Lowest price within 52 weeks
  var VolAvg;       //To be confirmed
  var Outstanding;  //Outstanding shares
  var Float;        //Float shares
  var VolDOI;       //To be confirmed
  var VolPreM;      //Premarket volume
  var PC;           //previous close price
  var PremHigh;      //Pre-market high price
  var Open;          //Open price
  var HOD;            //High of the day
  var HODTime;        //HOD time
  var LOD;            //Low of the day
  var LODTime;        //LOD time
  var Close;          //To be confirmed
  var AH;             //The price after hours
  var apidata;        //string in json format to respond to request from frontend
  var FromTimestamp   //Starting timestamp of speficifed time range
  var ToTimestamp     //Ending timestamp of speficifed time range
  var Interval        //Time interval between two consecutive data points in the time series.

  
  const api_key = finnhub.ApiClient.instance.authentications['api_key'];
  const finnhubClient = new finnhub.DefaultApi()

  finnhubClient.quote(StockSymbol.toUpperCase(), (error, data, response) => {
    Open = data['o'];          //Open price
    HOD = data['h'];           //High of the day
    LOD = data['l'];           //Low of the day
    Price = data['c'];         //Current price
    PC = data['pc'];           //previous close price
  });

  //convert regular time to Unix timestamp which is used in Finnhub API data
  function timestamp(hour,minute) {
    let date = new Date();
    date.setHours(hour,minute,0,0);
    date.setDate(22);
    timestampvalue = date.getTime()/1000;
    return timestampvalue;
  }
  
   //convert premarket time 1:00 and 6:29 to Unix timestamp
  FromTimestamp = timestamp(1,00);
  ToTimestamp = timestamp(6,29);
  Interval = 1;
  
  //Fetch Premarket volume and Pre-market high price from Finnhub premarket data
  const urlpremarket = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=${Interval}&from=${FromTimestamp}&to=${ToTimestamp}&token=c5n04giad3iam7tut000`;
  axios(urlpremarket)
    .then(response => {
      query = response.data;
      VolPreM = volumsum();
      PremHigh = Math.max(...query.h);
  
     function volumsum(){
      let sum = 0;
      for(let i = 0; i < (query.v.length); i++){
      sum += query.v[i];
      }
      return sum;
      }
  
  })
  .catch(console.error);

  //convert regular market time 9:30 and 13:00 to Unix timestamp
  FromTimestamp = timestamp(9,30);
  ToTimestamp = timestamp(13,00);
  Interval = 1;

  //Fetch HOD time and LOD time from Finnhub intraday data
  const urlintraday = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=${Interval}&from=${FromTimestamp}&to=${ToTimestamp}&token=c5n04giad3iam7tut000`;
  axios(urlintraday)
    .then(response => {
      query = response.data;
      HODTime = findhightime();
      LODTime = findlowtime();
     
       //find the time of highest price
      function findhightime(){
        let max = Math.max(...query.h);
        for(let i = 0; i < (query.h.length); i++){
             if (query.h[i] == max) {
                 var hightime = query.t[i] 
             }
        }
        hightime = converttime(hightime);
        return hightime; 
      }
  
      //find the time of lowest price
      function findlowtime(){
        let min = Math.min(...query.l);
        for(let i = 0; i < (query.l.length); i++){
             if (query.l[i] == min) {
                 var lowtime = query.t[i] 
             }
        }
        lowtime = converttime(lowtime);
        return lowtime; 
      }
  
      //convert Unix timestamp to regular time
      function converttime(time){
            let date = new Date(time * 1000);
            let hours = date.getHours();
            let minutes = "0" + date.getMinutes();
            let displayTime = hours + ':' + minutes.substr(-2)
            return displayTime;
      } 
  })
  .catch(console.error);

   //convert current time to Unix timestamp
    let date = new Date();
    date.setHours(17,0,0,0);
    date.setDate(22);
    ToTimestamp = date.getTime()/1000;
    FromTimestamp = timestamp(13,01);
    Interval = 1;
   
   //Fetch after hour price from Finnhub
   const urlafterhour = `https://finnhub.io/api/v1/stock/candle?symbol=${StockSymbol}&resolution=${Interval}&from=${FromTimestamp}&to=${ToTimestamp}&token=c5n04giad3iam7tut000`;
   axios(urlafterhour)
     .then(response => {
       query = response.data;
       AH = query.c[(query.c.length-1)]; 
   })
   .catch(console.error);
 
 //Fetch other data from Alpha Vantage API
  return rp({
      url: overviewurl,
      method: 'get',
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
     if (err) {
        console.log('Error:', err);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
      } else {
        Triker = StockSymbol;                         //Symbol
        Industry = data['Industry'];                  //Industry
        Exchange = data['Exchange'];                  //Exchange
        W52H = data['52WeekHigh'];                    //Highest price within 52 weeks
        L52H = data['52WeekLow'];                     //Lowest price within 52 weeks
        Outstanding = data['SharesOutstanding'];      //Outstanding shares
        Float = data['SharesFloat'];                  //Float 
      }     
  }).then((response) => {
    apidata = {                 
                  Triker: Triker,            //Symbol
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
    res.json(apidata);
  }).catch((err) => {
    console.error(err);
  }); 
}

export { getStockData };