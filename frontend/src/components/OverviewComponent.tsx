import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Col, Input, Row, Table } from "reactstrap";
import { Reports } from "../cssComponents/Reports";
import { IOverviewComponentState } from "../models/IOverviewComponentState";
import { Bar, Line, Pie } from "react-chartjs-2";
import axios, { AxiosResponse } from "axios";

const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dev"];

class OverviewComponent extends Component<any, IOverviewComponentState>
{
    constructor(props: any) {
        super(props);

        this.state = {
            collection: "",
            year: "2021",
            month: 1,
            data: []
        };

        this.getData = this.getData.bind(this);
    }

    componentDidMount(): void
    {
        this.setState({
            collection:  `${localStorage.getItem('reportsId')}_stock_data`
        });
        
        this.getData();
    }

    getData(): void {
        axios.get("http://localhost:3001/getTradesByYear", {
            params: {
                coll: this.state.collection,
                year: this.state.year
            }
        }).then((response: AxiosResponse<Object[]>) => {
            this.setState({ data: response.data });
        }).catch((err: Error) => {
            console.error(err);
        })
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
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    this.setState({ year: event.target.value });
                                }}
                            />
                        </Col>
                        <Col
                            xs="6"
                        >
                            {months.map((month: string, index: number) => {
                                return (
                                    <button
                                        onClick={() => {
                                            this.setState({ month: index + 1 });

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
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                {}
                                            </td>
                                            <td>
                                                {}
                                            </td>
                                            <td>
                                                {}
                                            </td>
                                            <td>
                                                {}
                                            </td>
                                            <td>
                                                {}
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
                                            labels: months, // Array of all DOI
                                            datasets: [{
                                                label: "Accumulated Profit",
                                                data: [1500, 1566, 1841, 2111, 1211, 100], // Sum of profits up to each date
                                                fill: false
                                            }]
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
                                                data: [1500, 1566] // Count of L and S of the position column.
                                            }]
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Bar 
                                    data={{
                                        labels: months, // Array of all DOI
                                        datasets: [{
                                            label: "Daily P/L",
                                            data: [1500, -1566, 1841, 2111, 1211, -100] // Profit / Loss at each date
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
                                        <th>
                                            Symbol
                                        </th>
                                        <th>
                                            P/L
                                        </th>
                                    </thead>
                                    <tbody>
                                        {/* TODO: Dynamically added stuff */}
                                    </tbody>
                                </Table>
                            </Row>
                            <Row>
                                <Table hover>
                                    <thead>
                                        <th>
                                            Symbol
                                        </th>
                                        <th>
                                            Average Gain %
                                        </th>
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
