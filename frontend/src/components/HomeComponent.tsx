import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Home } from "../cssComponents/Home";
import DataIcon from "../images/dataIcon.jpg";

class HomeComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <h1>Recent Files</h1>
                <Home.SECTION>
                    <Home.LEFT_HOME_MAIN_LIST_DIV_NOWRAP>
                        <Home.LEFT_HOME_MAIN_LIST>
                            <Link to="/input1"><Home.IMPORT_BUTTON>Import Broker Files</Home.IMPORT_BUTTON></Link>
                        </Home.LEFT_HOME_MAIN_LIST>
                    </Home.LEFT_HOME_MAIN_LIST_DIV_NOWRAP>
                    <Home.RIGHT_HOME>
                        <Home.DATA_ICON_DIV>
                            <Link to="/report"><Home.DATA_ICON src={DataIcon} alt="myData"/></Link>
                        </Home.DATA_ICON_DIV>
                    </Home.RIGHT_HOME>
                </Home.SECTION>
            </Fragment>
        );
    }
}
export { HomeComponent };
