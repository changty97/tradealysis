import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Header } from "../cssComponents/Header";
import Logo from "../images/logo_2.jpg";

class NavBarLoginComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <header id="allHeader">
                    <Header.THE_HEADER>
                        <div><h1><Link to="/home"><img src={Logo} alt="Tradalysis Logo" width="85%" /> </Link></h1></div>
                        <div className="headerButtons">
                            <Header.HEADER_BUTTONS_LIST>
                                <Header.HEADER_BUTTONS_LIST_LI>
                                    <Header.LINK_1 to="/login">
                                        <Header.HEADER_BUTTONS_LIST_LI_A>Home</Header.HEADER_BUTTONS_LIST_LI_A>
                                    </Header.LINK_1>
                                </Header.HEADER_BUTTONS_LIST_LI>
                                <Header.HEADER_BUTTONS_LIST_LI>
                                    <Header.LINK_1 to="/about">
                                        <Header.HEADER_BUTTONS_LIST_LI_A>About</Header.HEADER_BUTTONS_LIST_LI_A>
                                    </Header.LINK_1>
                                </Header.HEADER_BUTTONS_LIST_LI>
                            </Header.HEADER_BUTTONS_LIST>
                        </div>
                        <Header.USER_AND_SETTINGS_BUTTONS>
                            <Header.HEADER_BUTTONS_LIST>
                                <Header.HEADER_BUTTONS_LIST_LI>
                                    <Header.LINK_1 to="/">
                                        <Header.HEADER_BUTTONS_LIST_LI_A>Create new Account</Header.HEADER_BUTTONS_LIST_LI_A>
                                    </Header.LINK_1>
                                </Header.HEADER_BUTTONS_LIST_LI>
                            </Header.HEADER_BUTTONS_LIST>
                        </Header.USER_AND_SETTINGS_BUTTONS>
                    </Header.THE_HEADER>
                </header>
            </Fragment>
        );
    }
}
export { NavBarLoginComponent };
