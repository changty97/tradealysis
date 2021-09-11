import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";
import { NavBarComponent } from "../components/NavBarComponent";


class StrategiesComponent extends Component<IReportsProps, IReportsState>
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
                <button>New Pattern</button>
                <button>Your Reports</button>
            </Fragment>
        );
    }
}
export { StrategiesComponent };
