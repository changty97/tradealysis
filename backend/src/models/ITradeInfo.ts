export interface ITradeInfo {
    [symbol: string]: {
        buy: ITradeAction;
        sell: ITradeAction;
        DOI: string;
        position: string;
    };
}

interface ITradeAction {
    totalStocks: number;
    totalPrice: number;
}
