import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";
import { SheetComponent } from "../components/SheetComponent";
import { Link } from "react-router-dom";
import { Reports } from "../cssComponents/Reports";

class ReportsComponent extends Component<IReportsProps, IReportsState>
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <Reports.SECTION>
                    <Link to="/report"><button>Trade Report</button></Link>
                    <Link to="/overview"><button>Overview</button></Link>
                    <Link to="/strategies"><button>Strategies</button></Link>
                    <SheetComponent reportsId={this.props.reportsId}/>{/* Search bar & Export button moved within SheetComponent*/}
                </Reports.SECTION>
            </Fragment>
        );
    }
}
export { ReportsComponent };
