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
                    <Link to="/report"><button>Trade Report</button></Link>
                    <Link to="/overview"><button>Overview</button></Link>
                    <Link to="/strategies"><button>Strategies</button></Link>
                </Reports.SECTION>
            </Fragment>
        );
    }
}
export { Overview };
