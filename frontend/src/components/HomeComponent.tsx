import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";
// import { Link } from "react-router-dom";
import { NavBarComponent } from "./NavBarComponent";

class HomeComponent extends Component<IReportsProps, IReportsState>
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
                You are on the home page.
            </Fragment>
        );
    }
}
export { HomeComponent };
