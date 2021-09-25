import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";

/* import companyLogo from "../images/logo.jpg"; */
//import { Link } from "react-router-dom";

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
                <div className="theHeader">
                    <div>
                        <h1>
                            <a href="./home.html">
                                <img src="./logo.jpg" alt="Tradalysis Logo" width="85%" />
                            </a>
                        </h1>
                    </div>
                    <div className="headerButtons">
                        <ul className="headerButtonsList">
                            <li>
                                <a href="/home">
									Home
                                </a>
                            </li>
                            <li>
                                <a href="/report">
									Report
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="userAndSettingButtons">
                        <ul className="headerButtonsList">
                            <li>
                                <a href="">
									User
                                </a>
                            </li>
                            <li>
                                <a href="">
									Settings
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </Fragment>
        );
    }
}
export { NavBarComponent };
