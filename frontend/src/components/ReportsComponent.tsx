import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";
import { SheetComponent } from "../components/SheetComponent";
import { Link } from "react-router-dom";
import { NavBarComponent } from "./NavBarComponent";
import { FooterComponent } from "./FooterComponent";

class ReportsComponent extends Component<IReportsProps, IReportsState>
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
                <NavBarComponent />
                <Link to="/report"><button>Trade Report</button></Link>
                <Link to="/overview"><button>Overview</button></Link>
                <Link to="/strategies"><button>Strategies</button></Link>
                {/* Search bar & Export button moved within SheetComponent*/}
                <SheetComponent />
                <FooterComponent />
            </Fragment>
        );
    }
}
export { ReportsComponent };
