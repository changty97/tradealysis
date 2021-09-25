import { Component, Fragment } from "react";
import { NavBarComponent } from "../components/NavBarComponent";
import { Link } from "react-router-dom";
import { FooterComponent } from "./FooterComponent";

class StrategiesComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <NavBarComponent />
                <Link to="/report"><button>Trade Report</button></Link>
                <Link to="/overview"><button>Overview</button></Link>
                <Link to="/strategies"><button>Strategies</button></Link>
                <button style={ {
                    float: 'right'
                }}>New Pattern</button>
                <FooterComponent />
            </Fragment>
        );
    }
}
export { StrategiesComponent };
