import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";
import { NavBarComponent } from "../components/NavBarComponent";
import { Link } from "react-router-dom";


class StrategiesComponent extends Component<IReportsProps, IReportsState>
{
    constructor(props: IReportsProps)
    {
        super(props);

        this.state = {
            url: ""
        };

    }

    addStrategy() {

        
    }

    render(): JSX.Element
    {
        return (
            <Fragment>
                <NavBarComponent/>
                <Link to="/report"><button>Trade Report</button></Link>
                <Link to="/overview"><button>Overview</button></Link>
                <Link to="/strategies"><button>Strategies</button></Link>
                <button style={ {float: 'right'}}>New Pattern</button>
            </Fragment>
        );
    }
}
export { StrategiesComponent };
