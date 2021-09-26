import { Component, Fragment } from "react";
import { Link } from "react-router-dom";

/* import companyLogo from "../images/logo.jpg"; */

class NavBarComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
			
                {/*
                <div>
                    <button><img src={companyLogo} alt="Tradealysis Logo" width="50" height="50"/> </button>
                </div>
                <Link to="/home"><button>Home</button></Link>
                <Link to="/report"><button>Report</button></Link>
                <button>User</button>
                <button>Settings</button>
				
                <p>
					This is the end of the NavBar Component
                </p>
                <hr>
                </hr>
			*/}
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
                                <li>
                                    <Link to="/home">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/report">
                                            Trade Report
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="userAndSettingButtons">
                            <ul className="headerButtonsList">
                                <li>
                                    <Link to="/login"> {/* Replace with correct routing when they're created */}
                                        User
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/account"> {/* Replace with correct routing when they're created */}
                                        Settings
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </header>
            </Fragment>
        );
    }
}
export { NavBarComponent };
