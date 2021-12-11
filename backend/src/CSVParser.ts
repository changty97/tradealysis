import { sourcePatterns } from "./constants/sourcePatterns";
import { ICSVData } from "./models/ICSVData";
import { ISectionedContent } from "./models/ISectionedContent";
import csv from "csvtojson/v2";
import { ITableData } from "./models/ITableData";
import { ITradeInfo } from "./models/ITradeInfo";

class CSVParser
{
    private source: string = null;
    private parsedData: ICSVData = {
    };

    constructor(source: string)
    {
        if (!Object.keys(sourcePatterns).includes(source))
        {
            throw new Error(`"${source}" is not a recognized source.`);
        }

        this.source = source;
    }

    public async parse(file: Express.Multer.File): Promise<void>
    {
        switch (this.source)
        {
        case "TDAmeritrade":
            await this.parseTDAmeritrade(file);
            break;
        case "Tradealysis":
            await this.parseTradealysis(file);
            break;
        }
    }

    public filter(): ITableData[]
    {
        let filtered: ITableData[] = [];

        switch (this.source)
        {
        case "TDAmeritrade":
            filtered = this.filterTDAmeritrade();
            break;
        case "Tradealysis":
            filtered = this.parsedData["main"];
            break;
        }

        return filtered;
    }

    private async parseTradealysis(file: Express.Multer.File): Promise<void>
    {
        this.parsedData["main"] = await csv({
            ignoreEmpty: true,
            flatKeys: true
        })
            .fromString(file.buffer.toString());
    }

    private async parseTDAmeritrade(file: Express.Multer.File): Promise<void>
    {
        const sectionedData: ISectionedContent = {
        };
        const promises: PromiseLike<void>[] = [];
        let focus: string = null;

        /* Section out content */
        file.buffer.toString().split('\r').forEach((line: string) =>
        {
            line = line.trim();
            if (line === '')
            {
                focus = null;
            }

            if (focus)
            {
                if (!sectionedData[focus])
                {
                    sectionedData[focus] = "";
                }

                sectionedData[focus] += `${line}\n`;
            }

            if (sourcePatterns[this.source].sections.includes(line))
            {
                focus = line;
            }
        });

        /* Parse sections into JSON */
        Object.entries(sectionedData).forEach(([section, content]: [string, string]) =>
        {
            promises.push(csv({
                ignoreEmpty: true,
                flatKeys: true
            })
                .fromString(content)
                .then((json: ITableData[]) =>
                {
                    this.parsedData[section] = json;
                }));
        });

        await Promise.all(promises);
    }

    private filterTDAmeritrade(): ITableData[]
    {
        const stocksInfo: ITradeInfo = {
        };

        // Go through the Account Trade History in reverse and calculate average entry price
        // Will need to generalize this in the future, but for now just handle TDA pattern.
        this.parsedData["Account Trade History"].reverse().forEach((row: ITableData) =>
        {
            // Translate header names and grab the data.
            const symbol: string = row[sourcePatterns[this.source].translations["Ticker"]];
            const action: string = row[sourcePatterns[this.source].translations["Action"]];
            const DOI: string = row[sourcePatterns[this.source].translations["DOI"]];
            const quantity: number = -parseInt(row[sourcePatterns[this.source].translations["# Shares"]]);
            const priceTradedAt: number = parseFloat(row[sourcePatterns[this.source].translations["Price"]]);

            if (!Object.keys(stocksInfo).includes(symbol))
            {
                // Initialize counters
                stocksInfo[symbol] = {
                    buy: {
                        totalStocks: 0,
                        totalPrice: 0,
                    },
                    sell: {
                        totalStocks: 0,
                        totalPrice: 0,
                    },
                    DOI: "",
                    // If the first instance of a stock trade is a sale, the user is shorting the stock.
                    position: action === "SELL" ? "Short" : "Long",
                    quantity: Math.abs(quantity)
                };
            }

            // This will keep the last trade of the stock as the date of interest.
            stocksInfo[symbol].DOI = DOI;

            stocksInfo[symbol][action === "BUY" ? "buy" : "sell"].totalStocks += quantity;
            stocksInfo[symbol][action === "BUY" ? "buy" : "sell"].totalPrice += quantity * priceTradedAt;
        });

        // Calculate and reformat the data
        return Object.keys(stocksInfo).map((symbol: string) =>
        {
            /**
             * Some formulas I'm using here:
             *
             * Average entry price = |total price spent / # of stocks bought|
             * Average exit price = |total profit made / # of stocks sold|
             * Profit or loss = total profit made - total price spent
             * Profit or loss percentage = profit or loss / (# stocks sold * Average entry price)
             */
            const avgEntryPrice: number = Math.abs(stocksInfo[symbol].buy.totalPrice / stocksInfo[symbol].buy.totalStocks);
            const avgExitPrice: number = Math.abs(stocksInfo[symbol].sell.totalPrice / stocksInfo[symbol].sell.totalStocks);
            const PL: number = stocksInfo[symbol].sell.totalPrice + stocksInfo[symbol].buy.totalPrice;
            const PLPerc: number = PL / (stocksInfo[symbol].sell.totalStocks * avgEntryPrice);

            return {
                DOI: new Date(Date.parse(stocksInfo[symbol].DOI)).toISOString().split('T')[0],
                "P/L": PL.toFixed(2),
                "P/L %": (100 * PLPerc).toFixed(2),
                Broker: "TDAmeritrade",
                Ticker: symbol,
                Position: stocksInfo[symbol].position,
                "# Shares": stocksInfo[symbol].quantity.toString(),
                "Avg Entry": avgEntryPrice.toFixed(2),
                "Avg Exit": avgExitPrice.toFixed(2)
            };
        });
    }
}

export { CSVParser };
