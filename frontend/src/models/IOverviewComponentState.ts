interface IOverviewComponentState {
    year: string;
    month: number;
    data: any;
    results: IResults;
};

interface IResults {
    total: number;
    wins: number;
    avgGainPerTrade: number;
    avgGainPerTradePerc: number;
    totalTrades: number;
    longs: number;
    shorts: number;
    tradeDates: string[];
    dailyProfits: number[];
    dailyAccumulatedProfits: number[];
    topSymbolsByPL: {
        symbol: string;
        PL: number;
    }[];
}

export type { IOverviewComponentState, IResults }