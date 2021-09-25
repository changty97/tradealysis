import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";
// import { Link } from "react-router-dom";
import { NavBarComponent } from "./NavBarComponent";

import dataIcon from "../images/dataIcon.jpg";

//import * from "./styleSheets/headerNavBar.css";

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
                <html>
                    <body>
                        <header id="allHeader">
                            <NavBarComponent/>
                            {/*
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
                                            <a href="./home.html">
													Home
                                            </a>
                                        </li>
                                        <li>
                                            <a href="./report.html">
													Report
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="userAndSettingButtons">
                                    <ul className="headerButtonsList">
                                        <li>
                                            <a href="./account.html">
													User
                                            </a>
                                        </li>
                                        <li>
                                            <a href="./account1.html">
													Settings
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
						**/ }
                        </header>
							Test123
                        <section>
                            <div className="leftHome">
                                <div className="leftHomeMainListDiv noWrap">
                                    <ul className="leftHomeMainList pageOn">
                                        <li>
												Home
                                        </li>
                                    </ul>
                                    <ul className="leftHomeMainList">
                                        <button>
											Import Broker Files
                                        </button>
                                    </ul>
                                    
									
									
									
                                </div>
                            </div>
                            <div className="rightHome">
                                <div className="dataIconDiv">
                                    <img src={dataIcon} className="dataIcon" />
										
                                </div>
                            </div>
                        </section>
                        <footer>
                            <div>
                                <ul>
                                    <li>
                                        <a href="./account1.html">
												Your Account
                                        </a>
                                    </li>
                                    <li>
                                        <a href="./support.html">
												Support
                                        </a>
                                    </li>
                                    <li>
                                        <a href="./about.html">
												About
                                        </a>
                                    </li>
                                    <li>
                                        <a href="./privacy.html">
												Privacy Policy
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </footer>
		
                    </body>
                </html>
            </Fragment>
        );
    }
}
export { HomeComponent };
