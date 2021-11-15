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
                <Home.HEADER>Recent Files</Home.HEADER>
                {/* <AccountSettings.UL_HORIZ_LIST><AccountSettings.UL_HORIZ_LIST_LI>Your Account</AccountSettings.UL_HORIZ_LIST_LI></AccountSettings.UL_HORIZ_LIST> */}
                <Home.SECTION>
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
