import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Reports } from "../cssComponents/Reports";
import { IOverviewComponentState, IResults } from "../models/IOverviewComponentState";
import { Bar, Line, Pie } from "react-chartjs-2";
import { v4 as uuid } from "uuid";
import { Overview } from "../cssComponents/Overview";
import { api } from "../constants/globals";

const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dev"];

const formatter: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

class OverviewComponent extends Component<any, IOverviewComponentState>
{
    constructor(props: any)
    {
        super(props);

        this.state = {
            year: "21",
            month: 1,
            data: [],
            results: {
                total: 0,
                wins: 0,
                avgGainPerTrade: 0,
                avgGainPerTradePerc: 0,
                totalTrades: 0,
                totalGainPerc: 0,
                longs: 0,
                shorts: 0,
                tradeDates: [],
                dailyProfits: [],
                dailyAccumulatedProfits: [],
                topSymbolsByPL: [],
                topSymbolsByGainPerc: []
            }
        };

        this.getData = this.getData.bind(this);
        this.parseData = this.parseData.bind(this);
    }

    componentDidMount(): void
    {
        this.getData();
    }

    async getData(): Promise<void>
    {
        const username: string = (await api.get("usernameFromKeyGET", {
            params: {
                key: localStorage.getItem("Key"),
            }
        })).data;

        this.parseData((await api.get("getTradesByYear", {
            params: {
                coll: `${username}_${localStorage.getItem('reportsId')}`,
                year: this.state.year
            }
        })).data);
    }

    parseData(data: any): void
    {
        const results: IResults = {
            total: 0,
            wins: 0,
            avgGainPerTrade: 0,
            avgGainPerTradePerc: 0,
            totalTrades: 0,
            totalGainPerc: 0,
            longs: 0,
            shorts: 0,
            tradeDates: [],
            dailyProfits: [],
            dailyAccumulatedProfits: [],
            topSymbolsByPL: [],
            topSymbolsByGainPerc: []
        };

        data.forEach((row: any, index: number) =>
        {
            const profit: number = parseFloat(row["P/L"]);
            const gainPerc: number = parseFloat(row["P/L %"]);

            results.total += profit;
            results.wins += (profit > 0) ? 1 : 0;
            results.totalTrades++;
            results.totalGainPerc += gainPerc;
            results.longs += (row.Position === "Long") ? 1 : 0;
            results.shorts += (row.Position === "Short") ? 1 : 0;
            results.tradeDates.push(row.DOI);
            results.dailyProfits.push(profit);
            results.dailyAccumulatedProfits.push((results.dailyAccumulatedProfits[index - 1] || 0) + profit);
            results.topSymbolsByPL.push({
                symbol: row.Ticker,
                PL: profit
            });
            results.topSymbolsByGainPerc.push({
                symbol: row.Ticker,
                gainPerc
            });
        });
        
        results.avgGainPerTrade = results.total / results.totalTrades;
        results.avgGainPerTradePerc = results.totalGainPerc / results.totalTrades;

        results.topSymbolsByPL.sort((firstEl: any, secondEl: any) => secondEl.PL - firstEl.PL);
        results.topSymbolsByGainPerc.sort((firstEl: any, secondEl: any) => secondEl.gainPerc - firstEl.gainPerc);

        this.setState({
            data,
            results
        });
    }

    render(): JSX.Element
    {
        return (
            <Fragment>
                <Reports.SECTION>
                    <Link to="/report"><Reports.BUTTON>Trade Report</Reports.BUTTON></Link>
                    <Link to="/overview"><Reports.BUTTON>Overview</Reports.BUTTON></Link>
                    <Link to="/strategies"><Reports.BUTTON>Strategies</Reports.BUTTON></Link>
                    <Overview.ROW>
                        <div className="yearSelection">
                            <input
                                placeholder="Year"
                                value={this.state.year}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                {
                                    this.setState({
                                        year: event.target.value
                                    });
                                }}
                            />
                        </div>
                        <div className="monthSelection">
                            {months.map((month: string, index: number) =>
                            {
                                return (
                                    <Reports.BUTTON
                                        key={uuid()}
                                        onClick={() =>
                                        {
                                            this.setState({
                                                month: index + 1
                                            });

                                            this.getData();
                                        }}
                                        disabled={this.state.month === index + 1}
                                    >
                                        {month}
                                    </Reports.BUTTON>
                                );
                            })}
                        </div>
                    </Overview.ROW>
                    <Overview.ROW>
                        <Overview.LEFT>
                            <Overview.ROW>
                                <Overview.SUMMARY>
                                    <Overview.THEAD>
                                        <Overview.TR>
                                            <Overview.TH>
                                                Total P/L
                                            </Overview.TH>
                                            <Overview.TH>
                                                Wins
                                            </Overview.TH>
                                            <Overview.TH>
                                                Average Gain / Trade
                                            </Overview.TH>
                                            <Overview.TH>
                                                Average Gain / Trade %
                                            </Overview.TH>
                                            <Overview.TH>
                                                Total Trades
                                            </Overview.TH>
                                        </Overview.TR>
                                    </Overview.THEAD>
                                    <Overview.TBODY>
                                        <Overview.TR>
                                            <Overview.TD_COLORED
                                                value={this.state.results.total}
                                            >
                                                {formatter.format(this.state.results.total)}
                                            </Overview.TD_COLORED>
                                            <Overview.TD>
                                                {this.state.results.wins}
                                            </Overview.TD>
                                            <Overview.TD_COLORED
                                                value={this.state.results.avgGainPerTrade}
                                            >
                                                {formatter.format(this.state.results.avgGainPerTrade)}
                                            </Overview.TD_COLORED>
                                            <Overview.TD_COLORED
                                                value={this.state.results.avgGainPerTradePerc}
                                            >
                                                {this.state.results.avgGainPerTradePerc.toFixed(2)}%
                                            </Overview.TD_COLORED>
                                            <Overview.TD>
                                                {this.state.results.totalTrades}
                                            </Overview.TD>
                                        </Overview.TR>
                                    </Overview.TBODY>
                                </Overview.SUMMARY>
                            </Overview.ROW>
                            <Overview.ROW>
                                <Overview.LINE_CHART>
                                    <Line
                                        data={{
                                            labels: this.state.results.tradeDates, // Array of all DOI
                                            datasets: [{
                                                label: "Profit",
                                                data: this.state.results.dailyAccumulatedProfits, // Sum of profits up to each date
                                                fill: false,
                                                backgroundColor: "rgb(237, 125, 49)",
                                                borderColor: "rgb(237, 125, 49)"
                                            }],
                                        }}
                                        options={{
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: "Accumulated Profit"
                                                },
                                                legend: {
                                                    onClick: () =>
                                                    {
                                                        return;
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </Overview.LINE_CHART>
                                <Overview.PIE_CHART>
                                    <Pie
                                        data={{
                                            labels: ["Long", "Short"],
                                            datasets: [{
                                                label: "Long / Short",
                                                data: [this.state.results.longs, this.state.results.shorts], // Count of L and S of the position column.
                                                backgroundColor: [
                                                    "rgb(68, 114, 196)",
                                                    "rgb(237, 125, 49)"
                                                ],
                                                borderColor: [
                                                    "rgb(68, 114, 196)",
                                                    "rgb(237, 125, 49)"
                                                ]
                                            }]
                                        }}
                                        options={{
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: "Long / Short"
                                                },
                                                legend: {
                                                    onClick: () =>
                                                    {
                                                        return;
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </Overview.PIE_CHART>
                            </Overview.ROW>
                            <Overview.ROW>
                                <Bar
                                    data={{
                                        labels: this.state.results.tradeDates, // Array of all DOI
                                        datasets: [{
                                            label: "P/L",
                                            data: this.state.results.dailyProfits, // Profit / Loss at each date
                                            backgroundColor: this.state.results.dailyProfits.map((profit: number) => (profit > 0) ? "rgb(112, 173, 71)" : "rgb(255, 59, 59)")
                                        }]
                                    }}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: "Daily P/L"
                                            },
                                            legend: {
                                                onClick: () =>
                                                {
                                                    return;
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Overview.ROW>
                        </Overview.LEFT>
                        <Overview.RIGHT>
                            <Overview.ROW>
                                <Overview.TABLE>
                                    <Overview.CAPTION>Top symbols by P/L</Overview.CAPTION>
                                    <Overview.THEAD>
                                        <Overview.TR>
                                            <Overview.TH>
                                                Symbol
                                            </Overview.TH>
                                            <Overview.TH>
                                                P/L
                                            </Overview.TH>
                                        </Overview.TR>
                                    </Overview.THEAD>
                                    <Overview.TBODY>
                                        {this.state.results.topSymbolsByPL.map((row: any) =>
                                        {
                                            return (
                                                <Overview.TR key={uuid()}>
                                                    <Overview.TD_COLORED
                                                        value={row.PL}
                                                    >
                                                        {row.symbol}
                                                    </Overview.TD_COLORED>
                                                    <Overview.TD_COLORED
                                                        value={row.PL}
                                                    >
                                                        {formatter.format(row.PL.toFixed(2))}
                                                    </Overview.TD_COLORED>
                                                </Overview.TR>
                                            );
                                        })}
                                    </Overview.TBODY>
                                </Overview.TABLE>
                            </Overview.ROW>
                            <br />
                            <Overview.ROW>
                                <Overview.TABLE>
                                    <Overview.CAPTION>Top symbols by Gain %</Overview.CAPTION>
                                    <Overview.THEAD>
                                        <Overview.TR>
                                            <Overview.TH>
                                                Symbol
                                            </Overview.TH>
                                            <Overview.TH>
                                                Average Gain %
                                            </Overview.TH>
                                        </Overview.TR>
                                    </Overview.THEAD>
                                    <Overview.TBODY>
                                        {this.state.results.topSymbolsByGainPerc.map((row: any) =>
                                        {
                                            return (
                                                <Overview.TR key={uuid()}>
                                                    <Overview.TD_COLORED
                                                        value={row.gainPerc}
                                                    >
                                                        {row.symbol}
                                                    </Overview.TD_COLORED>
                                                    <Overview.TD_COLORED
                                                        value={row.gainPerc}
                                                    >
                                                        {row.gainPerc.toFixed(2)}%
                                                    </Overview.TD_COLORED>
                                                </Overview.TR>
                                            );
                                        })}
                                    </Overview.TBODY>
                                </Overview.TABLE>
                            </Overview.ROW>
                        </Overview.RIGHT>
                    </Overview.ROW>
                </Reports.SECTION>
            </Fragment>
        );
    }
}
export { OverviewComponent };
