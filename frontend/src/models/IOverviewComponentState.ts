interface IOverviewComponentState {
    minDate: Date | null;
    maxDate: Date | null;
    selectedStartDate: Date | null;
    selectedEndDate: Date | null;
    rawData: any;
    filteredData: any;
    results: IResults;
    loading: boolean;
};

interface IResults {
    total: number;
    wins: number;
    avgGainPerTrade: number;
    avgGainPerTradePerc: number;
    totalTrades: number;
    totalGainPerc: number;
    longs: number;
    shorts: number;
    tradeDates: string[];
    dailyProfits: number[];
    dailyAccumulatedProfits: number[];
    topSymbolsByPL: {
        symbol: string;
        PL: number;
    }[];
    topSymbolsByGainPerc: {
        symbol: string;
        gainPerc: number;
    }[]
}

export type { IOverviewComponentState, IResults }