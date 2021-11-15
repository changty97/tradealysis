import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Reports } from "../cssComponents/Reports";

class Overview extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <Reports.SECTION>
                    <Link to="/report"><Reports.BUTTON>Trade Report</Reports.BUTTON></Link>
                    <Link to="/overview"><Reports.BUTTON>Overview</Reports.BUTTON></Link>
                    <Link to="/strategies"><Reports.BUTTON>Strategies</Reports.BUTTON></Link>
                </Reports.SECTION>
            </Fragment>
        );
    }
}
export { Overview };
