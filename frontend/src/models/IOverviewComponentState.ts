export interface IOverviewComponentState {
    year: string;
    month: number;
    data: ITradeBrief[];
};

interface ITradeBrief {
    Position: string;
    "P/L": number;
    // Shares: number;
}
