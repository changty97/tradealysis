import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";
import companyLogo from "../images/logo.jpg";

import { Link } from "react-router-dom";

class NavBarComponent extends Component<IReportsProps, IReportsState>
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
                <div>
                    <button><img src={companyLogo} alt="Tradealysis Logo"
                        width="50" height="50"/></button>
                </div>
                <button>Home</button>
                <Link to="/report">Report</Link>
                <button>User</button>
                <button>Settings</button>
                <p>This is the end of the NavBar Component</p>
                <hr></hr>
            </Fragment>
        );
    }
}
export { NavBarComponent };
