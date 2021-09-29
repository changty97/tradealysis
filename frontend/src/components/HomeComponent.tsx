import { Component, Fragment } from "react";
import { Link } from "react-router-dom";

import { All } from "../cssComponents/All";
import { NavBarComponent } from "./NavBarComponent";
import { Home } from "../cssComponents/Home";
import { FooterComponent } from "./FooterComponent";
import DataIcon from "../images/dataIcon.jpg";

class HomeComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <All.HTML><style>{'body { background-color: rgb(170,170,170); }'}</style>
                    <All.HTML_BODY>
                        <NavBarComponent />
                        <Home.SECTION>
                            <Home.LEFT_HOME>
                                <Home.LEFT_HOME_MAIN_LIST_DIV_NOWRAP>
                                    <Home.LEFT_HOME_MAIN_LIST_PAGEON>
                                        <li>Home</li>
                                    </Home.LEFT_HOME_MAIN_LIST_PAGEON>
                                    <Home.LEFT_HOME_MAIN_LIST>
                                        <Link to="/input1"><Home.IMPORT_BUTTON>Import Broker Files</Home.IMPORT_BUTTON></Link>
                                    </Home.LEFT_HOME_MAIN_LIST>
                                </Home.LEFT_HOME_MAIN_LIST_DIV_NOWRAP>
                            </Home.LEFT_HOME>
                            <Home.RIGHT_HOME>
                                <Home.DATA_ICON_DIV>
                                    <Link to="/report"><Home.DATA_ICON src={DataIcon} alt="myData"/></Link>
                                </Home.DATA_ICON_DIV>
                            </Home.RIGHT_HOME>
                        </Home.SECTION>
                        <FooterComponent />
                    </All.HTML_BODY>
                </All.HTML>
            </Fragment>
        );
    }
}
export { HomeComponent };
