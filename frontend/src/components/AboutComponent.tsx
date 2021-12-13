import { Component, Fragment } from "react";
import { About } from "../cssComponents/About";

/** About Component **/
class AboutComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <About.SECTION>
                    <About.ABOUT_RIGHT_HOME>
                        <h1>About Tradealysis</h1>
                        <p>Whether you're a new or experienced trader, significant time is spent analyzing your trades. Gathering data from your brokerage account, finding relevant data on financial websites, and defining custom calculations based on said data: Tradealysis conveniently automates this process and organizes your data on a spreadsheet.</p>
                        <ul>
                            <li>CSV files imported from brokerages such as TDAmeritrade will be parsed and placed in a spreadsheet.</li>
                            <li>When a stock symbol is entered in a row, additional live and historical data will be fetched and rendered on each row.</li>
                            <li>Trades can be searched as well as organized by column, and spreadsheets can be exported in CSV format. </li>
                            <li>An Overview page will display statistics related to profits throughout your trading history. </li>
                        </ul>
                        <p>By tracking your performance, Tradealysis allows you to identify key patterns in your trade history in order to maximize profits.</p>
                        <h1>Contact Us</h1>
                        <a href = "mailto: tradealysisapp@gmail.com">Email</a>
                    </About.ABOUT_RIGHT_HOME>
                </About.SECTION>
            </Fragment>
        );
    }
}
export { AboutComponent };
