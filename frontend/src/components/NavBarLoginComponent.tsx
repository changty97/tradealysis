import { Component, Fragment } from "react";
import { Link } from "react-router-dom";

/* import companyLogo from "../images/logo.jpg"; */

class NavBarLoginComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <header id="allHeader">
                    <div className="theHeader">
                        <div>
                            <h1>
                                <Link to="/home">
                                    <img src="./logo.jpg" alt="Tradalysis Logo" width="85%" />
                                </Link>
                            </h1>
                        </div>
                        <div className="headerButtons">
                            <ul className="headerButtonsList">
                                <li><Link to="/login">Home</Link></li>
                                <li><Link to="/about">About</Link></li>
                            </ul>
                        </div>
                        <div className="userAndSettingButtons">
                            <ul className="headerButtonsList">
                                <li><Link to="/"> {/* Replace with correct routing when they're created */} Create new Account</Link></li>
                            </ul>
                        </div>
                    </div>
                </header>
            </Fragment>
        );
    }
}
export { NavBarLoginComponent };
