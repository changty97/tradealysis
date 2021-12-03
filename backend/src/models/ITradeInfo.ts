export interface ITradeInfo {
    [symbol: string]: {
        buy: ITradeAction;
        sell: ITradeAction;
        DOI: string;
        position: string;
        quantity: number;
    };
}

interface ITradeAction {
    totalStocks: number;
    totalPrice: number;
}
