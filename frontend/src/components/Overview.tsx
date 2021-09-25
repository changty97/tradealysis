import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { NavBarComponent } from "./NavBarComponent";

class Overview extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <NavBarComponent />
                <Link to="/report"><button>Trade Report</button></Link>
                <Link to="/overview"><button>Overview</button></Link>
                <Link to="/strategies"><button>Strategies</button></Link>
            </Fragment>
        );
    }
}
export { Overview };
