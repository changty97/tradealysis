import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Reports } from "../cssComponents/Reports";

class StrategiesComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <Reports.SECTION>
                    <Link to="/report"><Reports.BUTTON>Trade Report</Reports.BUTTON></Link>
                    <Link to="/overview"><Reports.BUTTON>Overview</Reports.BUTTON></Link>
                    <Link to="/strategies"><Reports.BUTTON>Strategies</Reports.BUTTON></Link>
                    <Reports.BUTTON style={ {
                        float: 'right',
                        backgroundColor: '#4CAF50'
                    }}>New Pattern</Reports.BUTTON>
                </Reports.SECTION>
            </Fragment>
        );
    }
}
export { StrategiesComponent };
