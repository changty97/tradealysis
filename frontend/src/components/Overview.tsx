import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";
import { Link } from "react-router-dom";
import { NavBarComponent } from "./NavBarComponent";

class Overview extends Component<IReportsProps, IReportsState>
{
    constructor(props: IReportsProps)
    {
        super(props);

        this.state = {
            url: ""
        };

    }

    render(): JSX.Element
    {
        return (
            <Fragment>
                <NavBarComponent/>
                <Link to="/report">Trades</Link>
                <button>Reports</button>
                <Link to="/report/overview">Overview</Link>
                <Link to="/strategies">Strategies</Link>
                <button>Search</button>
                <button>Export File</button>
            </Fragment>
        );
    }
}
export { Overview };
