import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Col, Input, Row, Table } from "reactstrap";
import { Reports } from "../cssComponents/Reports";
import { IOverviewComponentState, IResults } from "../models/IOverviewComponentState";
import { Bar, Line, Pie } from "react-chartjs-2";
import axios, { AxiosResponse } from "axios";
import { v4 as uuid } from "uuid";

const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dev"];

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
                longs: 0,
                shorts: 0,
                tradeDates: [],
                dailyProfits: [],
                dailyAccumulatedProfits: [],
                topSymbolsByPL: []
            }
        };

        this.getData = this.getData.bind(this);
        this.parseData = this.parseData.bind(this);
    }

    componentDidMount(): void
    {
        this.getData();
    }

    getData(): void
    {
        axios.get("http://localhost:3001/getTradesByYear", {
            params: {
                coll: `${localStorage.getItem('reportsId')}_stock_data`,
                year: this.state.year
            }
        }).then((response: AxiosResponse<any>) =>
        {
            this.parseData(response.data);

        }).catch((err: Error) =>
        {
            console.error(err);
        });
    }

    parseData(data: any): void {
        const results: IResults = {
            total: 0,
            wins: 0,
            avgGainPerTrade: 0,
            avgGainPerTradePerc: 0,
            totalTrades: 0,
            longs: 0,
            shorts: 0,
            tradeDates: [],
            dailyProfits: [],
            dailyAccumulatedProfits: [],
            topSymbolsByPL: []
        };

        data.forEach((row: any, index: number) => {
            const profit: number = parseFloat(row["P/L"]);

            results.total += profit;
            results.wins += (profit > 0) ? 1 : 0;
            results.totalTrades++;
            results.longs += (row.Position === "Long") ? 1 : 0;
            results.shorts += (row.Position === "Short") ? 1 : 0;
            results.tradeDates.push(row.DOI);
            results.dailyProfits.push(profit);
            results.dailyAccumulatedProfits.push((results.dailyAccumulatedProfits[index - 1] || 0) + profit)
            results.topSymbolsByPL.push({
                symbol: row.Ticker,
                PL: profit
            });
        });
        
        results.avgGainPerTrade = results.total / results.totalTrades;

        // I have no idea how to calculate average gain / trade %

        results.topSymbolsByPL.sort((firstEl: any, secondEl: any) => secondEl.PL - firstEl.PL);

        this.setState({ 
            data,
            results 
        });
    }

    // TODO: None of this will style properly unless we import bootstrap, but then that breaks all other styles everywhere...
    render(): JSX.Element
    {
        return (
            <Fragment>
                <Reports.SECTION>
                    <Link to="/report"><button>Trade Report</button></Link>
                    <Link to="/overview"><button>Overview</button></Link>
                    <Link to="/strategies"><button>Strategies</button></Link>
                    <Row>
                        <Col
                            xs="3"
                        >
                            <Input
                                placeholder="Year"
                                value={this.state.year}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                {
                                    this.setState({
                                        year: event.target.value
                                    });
                                }}
                            />
                        </Col>
                        <Col
                            xs="6"
                        >
                            {months.map((month: string, index: number) =>
                            {
                                return (
                                    <button
                                        key={uuid()}
                                        onClick={() =>
                                        {
                                            this.setState({
                                                month: index + 1
                                            });

                                            this.getData();
                                        }}
                                    >
                                        {month}
                                    </button>
                                );
                            })}
                        </Col>
                    </Row>
                    <Row>
                        <Col
                            xs="6"
                        >
                            <Row>
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th>
                                                Total P/L
                                            </th>
                                            <th>
                                                Wins
                                            </th>
                                            <th>
                                                Average Gain / Trade
                                            </th>
                                            <th>
                                                Average Gain / Trade %
                                            </th>
                                            <th>
                                                Total Trades
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                {this.state.results.total}
                                            </td>
                                            <td>
                                                {this.state.results.wins}
                                            </td>
                                            <td>
                                                {this.state.results.avgGainPerTrade}
                                            </td>
                                            <td>
                                                {this.state.results.avgGainPerTradePerc}
                                            </td>
                                            <td>
                                                {this.state.results.totalTrades}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Row>
                            <Row>
                                <Col
                                    xs="7"
                                >
                                    <Line
                                        data={{
                                            labels: this.state.results.tradeDates, // Array of all DOI
                                            datasets: [{
                                                label: "Accumulated Profit",
                                                data: this.state.results.dailyAccumulatedProfits, // Sum of profits up to each date
                                                fill: false,
                                                backgroundColor: "rgb(237, 125, 49)",
                                                borderColor: "rgb(237, 125, 49)"
                                            }],
                                        }}
                                    />
                                </Col>
                                <Col
                                    xs="2"
                                >
                                    <Pie data={{
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
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Bar
                                    data={{
                                        labels: this.state.results.tradeDates, // Array of all DOI
                                        datasets: [{
                                            label: "Daily P/L",
                                            data: this.state.results.dailyProfits, // Profit / Loss at each date
                                            backgroundColor: this.state.results.dailyProfits.map((profit: number) => (profit > 0) ? "rgb(112, 173, 71)" : "rgb(255, 59, 59)")
                                        }]
                                    }}
                                />
                            </Row>
                        </Col>
                        <Col
                            xs="3"
                        >
                            <Row>
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th>
                                                Symbol
                                            </th>
                                            <th>
                                                P/L
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.results.topSymbolsByPL.map((row: any) => {
                                            return(
                                                <tr key={uuid()}>
                                                    <td>
                                                        {row.symbol}
                                                    </td>
                                                    <td>
                                                        {row.PL}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </Row>
                            <Row>
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th>
                                                Symbol
                                            </th>
                                            <th>
                                                Average Gain %
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* TODO: Dynamically added stuff */}
                                    </tbody>
                                </Table>
                            </Row>
                        </Col>
                    </Row>
                </Reports.SECTION>
            </Fragment>
        );
    }
}
export { OverviewComponent };
